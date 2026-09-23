import Link from "next/link";
import { BrandLogo } from "./brand-logo";
import { ThemeToggle } from "./theme-toggle";

export default function NotFound() {
  return (
    <main className="lesson-page min-h-screen">
      <div className="page-frame py-12">
        <header className="lesson-header flex items-center justify-between pb-8 border-b border-surface-border">
          <BrandLogo />
          <ThemeToggle />
        </header>

        <section className="mt-16 text-center max-w-xl mx-auto">
          <p className="eyebrow">404 · QUEST NOT FOUND</p>
          <h1 className="lesson-title mt-3 text-4xl font-black tracking-tight sm:text-5xl">
            This chapter hasn&apos;t been discovered yet.
          </h1>
          <p className="body-muted mt-4 text-base leading-relaxed">
            The chapter, challenge, or checkpoint quiz you were looking for doesn&apos;t exist or may have been relocated.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link href="/dashboard" className="quest-button px-6 py-3 font-extrabold">
              Go to Dashboard
            </Link>
            <Link href="/" className="secondary-button px-6 py-3 font-bold">
              Home
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
