"use client";

import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export function LogoutButton({ compact = false }: { compact?: boolean }) {
  const router = useRouter();

  async function signOut() {
    await createClient().auth.signOut();
    router.replace("/");
    router.refresh();
  }

  return <button type="button" onClick={() => void signOut()} className={compact ? "theme-toggle" : "secondary-button px-4 py-2 text-sm font-bold"}>Log out</button>;
}
