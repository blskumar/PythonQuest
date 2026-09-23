import { createBrowserClient } from "@supabase/ssr";

const DEFAULT_SUPABASE_URL = "https://yfzwdaiwsvllmantsrzc.supabase.co";
const DEFAULT_SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlmendkYWl3c3ZsbG1hbnRzcnpjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODk4MTgyNDgsImV4cCI6MjEwNTM5NDI0OH0.dvh-vrB3MBnYW3QeYsaBBkvxHAOPvNJCzpP7h71bv-o";

export function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || DEFAULT_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || DEFAULT_SUPABASE_KEY;
  return createBrowserClient(url, key);
}