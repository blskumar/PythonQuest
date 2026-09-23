"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { LogoutButton } from "./logout-button";

interface HomeAuthNavProps {
  initialUser: boolean;
}

export function HomeHeaderAuth({ initialUser }: HomeAuthNavProps) {
  const [isLoggedIn, setIsLoggedIn] = useState(initialUser);

  useEffect(() => {
    const supabase = createClient();
    void supabase.auth.getUser().then((res) => {
      setIsLoggedIn(Boolean(res?.data?.user));
    }).catch(() => {
      setIsLoggedIn(false);
    });

    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsLoggedIn(Boolean(session?.user));
    });

    return () => {
      data?.subscription?.unsubscribe();
    };
  }, []);

  if (isLoggedIn) {
    return (
      <div className="flex items-center gap-3">
        <Link href="/dashboard" className="link-primary text-sm font-bold">
          Dashboard
        </Link>
        <LogoutButton compact />
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <Link href="/login" className="link-primary text-sm font-bold">
        Sign in
      </Link>
      <Link href="/register" className="quest-button px-3.5 py-1.5 text-xs font-bold">
        Get started
      </Link>
    </div>
  );
}

export function HomeHeroAuth({ initialUser }: HomeAuthNavProps) {
  const [isLoggedIn, setIsLoggedIn] = useState(initialUser);

  useEffect(() => {
    const supabase = createClient();
    void supabase.auth.getUser().then((res) => {
      setIsLoggedIn(Boolean(res?.data?.user));
    }).catch(() => {
      setIsLoggedIn(false);
    });

    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsLoggedIn(Boolean(session?.user));
    });

    return () => {
      data?.subscription?.unsubscribe();
    };
  }, []);

  if (isLoggedIn) {
    return (
      <div className="mt-8 flex flex-wrap items-center gap-3">
        <Link href="/dashboard" className="quest-button px-6 py-3 font-extrabold inline-flex items-center gap-2">
          Go to Dashboard →
        </Link>
        <LogoutButton />
      </div>
    );
  }

  return (
    <div className="mt-8 flex flex-wrap items-center gap-3">
      <Link href="/register" className="quest-button px-6 py-3 font-extrabold">
        Start learning
      </Link>
      <Link href="/login" className="secondary-button px-6 py-3 font-bold">
        Sign in
      </Link>
    </div>
  );
}
