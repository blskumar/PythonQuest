import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

const DEFAULT_SUPABASE_URL = "https://yfzwdaiwsvllmantsrzc.supabase.co";
const DEFAULT_SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlmendkYWl3c3ZsbG1hbnRzcnpjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODk4MTgyNDgsImV4cCI6MjEwNTM5NDI0OH0.dvh-vrB3MBnYW3QeYsaBBkvxHAOPvNJCzpP7h71bv-o";

export async function createClient() {
  const cookieStore = await cookies();
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || DEFAULT_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || DEFAULT_SUPABASE_KEY;

  return createServerClient(url, key, {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options);
            });
          } catch {
            // Server Components cannot always modify cookies.
            // Session refresh is handled by proxy.ts.
          }
        },
      },
    }
  );
}