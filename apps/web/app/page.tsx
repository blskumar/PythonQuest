import { BrandLogo } from "./brand-logo";
import { ThemeToggle } from "./theme-toggle";
import { HomeHeaderAuth, HomeHeroAuth } from "./home-auth-nav";
import { createClient } from "@/lib/supabase/server";

export default async function HomePage() {
  const { data: { user } } = await (await createClient()).auth.getUser();
  const hasUser = Boolean(user);

  return (
    <main className="expedition-page px-4 py-6 sm:px-6 sm:py-10">
      <div className="page-frame">
        <header className="app-header-inner">
          <BrandLogo />
          <div className="app-header-actions">
            <HomeHeaderAuth initialUser={hasUser} />
            <ThemeToggle />
          </div>
        </header>

        <section className="mt-16 grid items-center gap-12 lg:grid-cols-[1.05fr_.95fr] lg:mt-24">
          <div>
            <p className="eyebrow">A PRACTICAL PYTHON LEARNING PATH</p>
            <h1 className="mt-3 max-w-3xl text-4xl font-black tracking-tight sm:text-6xl">
              Learn Python by building real things.
            </h1>
            <p className="body-muted mt-5 max-w-2xl text-lg leading-8">
              A calm, structured place to learn the fundamentals, practice in a real console, and see your progress compound one quest at a time.
            </p>
            <HomeHeroAuth initialUser={hasUser} />
          </div>
        <div className="code-preview" aria-label="Python console preview">
          <div className="code-preview-bar"><span><i className="code-dot code-dot-red" /><i className="code-dot code-dot-yellow" /><i className="code-dot code-dot-green" /></span><span>quest_01.py</span></div>
          <pre><code><span className="code-comment"># Your first quest</span>{"\n"}<span className="code-name">quest_xp</span> = <span className="code-number">50</span>{"\n"}<span className="code-function">print</span>(<span className="code-name">quest_xp</span>){"\n\n"}<span className="code-output">50  # quest complete</span></code></pre>
          <div className="code-preview-footer"><span>Python console</span><span className="code-status">Ready to run</span></div>
        </div>
      </section>
      <section className="mt-20 grid gap-4 sm:grid-cols-3">
        <article className="surface p-5"><p className="eyebrow">01</p><h2 className="mt-3 font-bold">A clear path</h2><p className="body-muted mt-2 text-sm">Move from variables to projects through focused chapters.</p></article>
        <article className="surface p-5"><p className="eyebrow">02</p><h2 className="mt-3 font-bold">Practice as you learn</h2><p className="body-muted mt-2 text-sm">Run Python in the browser and learn from immediate feedback.</p></article>
        <article className="surface p-5"><p className="eyebrow">03</p><h2 className="mt-3 font-bold">Progress you can see</h2><p className="body-muted mt-2 text-sm">Build XP, keep a streak, and unlock the next challenge.</p></article>
      </section>
      <section className="mt-20 grid gap-7 lg:grid-cols-[.9fr_1.1fr] lg:items-start">
        <div>
          <p className="eyebrow">WHAT YOU WILL BUILD</p>
          <h2 className="mt-3 max-w-xl text-3xl font-black text-slate-50 sm:text-4xl">A learning loop that feels like progress.</h2>
          <p className="mt-4 max-w-xl text-lg leading-8 text-slate-300">Short lessons, hands-on Python challenges, and just enough guidance to keep you moving without taking the discovery away.</p>
          <div className="mt-7 grid gap-4 sm:grid-cols-2">
            <article className="feature-line"><span className="feature-number">01</span><div><h3 className="font-black">Practice in the console</h3><p className="mt-1 text-sm text-slate-300">Write and run Python right inside each exercise.</p></div></article>
            <article className="feature-line"><span className="feature-number">02</span><div><h3 className="font-black">Earn meaningful XP</h3><p className="mt-1 text-sm text-slate-300">Complete quests and keep your learning streak alive.</p></div></article>
            <article className="feature-line"><span className="feature-number">03</span><div><h3 className="font-black">Use hints strategically</h3><p className="mt-1 text-sm text-slate-300">Get unstuck while protecting your challenge reward.</p></div></article>
            <article className="feature-line"><span className="feature-number">04</span><div><h3 className="font-black">See your path grow</h3><p className="mt-1 text-sm text-slate-300">Unlock chapters from variables to real projects.</p></div></article>
          </div>
        </div>
        <div className="code-preview" aria-label="Python console preview">
          <div className="code-preview-bar"><span><i className="code-dot code-dot-red" /><i className="code-dot code-dot-yellow" /><i className="code-dot code-dot-green" /></span><span>quest_01.py</span></div>
          <pre><code><span className="code-comment"># Your first quest</span>{"\n"}<span className="code-name">quest_xp</span> = <span className="code-number">50</span>{"\n"}<span className="code-function">print</span>(<span className="code-name">quest_xp</span>){"\n\n"}<span className="code-output">50  # quest complete</span></code></pre>
          <div className="code-preview-footer"><span>Python console</span><span className="code-status">Ready to run</span></div>
        </div>
      </section>
    </div>
  </main>
  );
}
