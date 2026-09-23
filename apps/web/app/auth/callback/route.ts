import { NextResponse } from "next/server";
import type { EmailOtpType } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const tokenHash = requestUrl.searchParams.get("token_hash");
  const otpType = requestUrl.searchParams.get("type") as EmailOtpType | null;
  const authError = requestUrl.searchParams.get("error");
  const authErrorDesc = requestUrl.searchParams.get("error_description");

  const redirectUrl = (path: string) => NextResponse.redirect(new URL(path, requestUrl.origin));
  const requestedNext = requestUrl.searchParams.get("next");
  const isSafeNext = requestedNext && requestedNext.startsWith("/") && !requestedNext.startsWith("//") && !requestedNext.startsWith("/\\");
  const nextPath = isSafeNext ? requestedNext : "/dashboard";

  if (authError) {
    console.error("auth/callback: received error from auth provider", authError, authErrorDesc);
    const params = new URLSearchParams({ error: authError });
    if (authErrorDesc) params.set("error_description", authErrorDesc);
    return redirectUrl(`/login?${params.toString()}`);
  }

  if (!code && !tokenHash) {
    return redirectUrl("/login?error=missing_verification_code");
  }

  const supabase = await createClient();

  let user = null;
  if (code) {
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);
    if (error || !data.user) {
      console.error("auth/callback: exchangeCodeForSession failed", error);
      return redirectUrl("/login?error=verification_failed");
    }
    user = data.user;
  } else if (tokenHash && otpType) {
    const { data, error } = await supabase.auth.verifyOtp({ token_hash: tokenHash, type: otpType });
    if (error || !data.user) {
      console.error("auth/callback: verifyOtp failed", error);
      return redirectUrl("/login?error=verification_failed");
    }
    user = data.user;
  } else {
    return redirectUrl("/login?error=missing_verification_code");
  }

  // Preserve existing user profile (e.g. on password reset or subsequent OAuth logins)
  const { data: existingProfile } = await supabase
    .from("profiles")
    .select("id")
    .eq("user_id", user.id)
    .maybeSingle();

  if (!existingProfile) {
    const metadata = user.user_metadata ?? {};
    const displayName = metadata.learner_name || metadata.display_name || user.email?.split("@")[0] || "Explorer";
    const learnerLevel = metadata.learner_type === "Student" ? "Student" : metadata.learner_type === "Junior" ? "Junior" : "Professional";
    const profileRow = {
      user_id: user.id,
      username: metadata.username ?? null,
      display_name: displayName,
      age: metadata.age ? Number(metadata.age) : null,
      email: user.email ?? null,
      profession: metadata.learner_type ?? metadata.profession ?? null,
      learner_level: learnerLevel,
      grade: metadata.grade ?? null,
      school_name: metadata.school_name ?? null,
      learning_goal: metadata.learning_goal ?? null,
    };
    const { error: profileError } = await supabase.from("profiles").upsert(profileRow, { onConflict: "user_id" });

    if (profileError) {
      // The username was reserved client-side at registration, but a race
      // between two signups can still let both grab it. Don't strand an
      // otherwise-verified user over a username clash: drop the username and
      // keep the rest of the profile.
      if (profileError.code === "23505") {
        const { error: retryError } = await supabase
          .from("profiles")
          .upsert({ ...profileRow, username: null }, { onConflict: "user_id" });
        if (retryError) {
          console.error("auth/callback: profile upsert retry failed", retryError);
          return redirectUrl("/login?error=profile_setup_failed");
        }
      } else {
        console.error("auth/callback: profile upsert failed", profileError);
        return redirectUrl("/login?error=profile_setup_failed");
      }
    }
  }

  return redirectUrl(nextPath);
}