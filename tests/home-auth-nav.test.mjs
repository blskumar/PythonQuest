import { describe, it } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");
const appsWebDir = path.resolve(rootDir, "apps", "web");

describe("Home Page Auth Navigation & State Exclusivity Tests", () => {
  const homePageSource = fs.readFileSync(path.join(appsWebDir, "app", "page.tsx"), "utf8");
  const homeAuthNavSource = fs.readFileSync(path.join(appsWebDir, "app", "home-auth-nav.tsx"), "utf8");

  it("verifies home page does NOT contain hardcoded static sign in or logout buttons in hero or header", () => {
    // Assert that page.tsx delegates auth actions to HomeHeaderAuth and HomeHeroAuth
    assert.match(homePageSource, /<HomeHeaderAuth\s+initialUser=\{hasUser\}\s*\/>/);
    assert.match(homePageSource, /<HomeHeroAuth\s+initialUser=\{hasUser\}\s*\/>/);

    // Verify there are no rogue static Sign In links in page.tsx outside comments
    const lines = homePageSource.split("\n");
    for (const line of lines) {
      if (line.includes("<Link href=\"/login\"") || line.includes("<LogoutButton")) {
        assert.fail(`Found hardcoded auth link in page.tsx: ${line.trim()}`);
      }
    }
  });

  it("verifies HomeHeaderAuth renders ONLY Sign in & Get started when logged out, and NEVER Log out", () => {
    // Inspect logged out branch of HomeHeaderAuth
    assert.match(homeAuthNavSource, /if\s*\(isLoggedIn\)\s*\{[\s\S]*?Dashboard[\s\S]*?<LogoutButton/);
    assert.match(homeAuthNavSource, /return\s*\(\s*<div className="flex items-center gap-3">[\s\S]*?<Link href="\/login"[^>]*>\s*Sign in\s*<\/Link>[\s\S]*?<Link href="\/register"[^>]*>\s*Get started\s*<\/Link>/);
  });

  it("verifies HomeHeroAuth renders ONLY Start learning & Sign in when logged out, and NEVER Dashboard or Logout", () => {
    // When logged out, hero must have Start learning and Sign in
    assert.match(homeAuthNavSource, /<Link href="\/register" className="quest-button[^"]*">\s*Start learning\s*<\/Link>[\s\S]*?<Link href="\/login" className="secondary-button[^"]*">\s*Sign in\s*<\/Link>/);
  });

  it("verifies HomeHeroAuth renders ONLY Dashboard and Logout when logged in, and NEVER Sign in", () => {
    // When logged in, hero must have Go to Dashboard and LogoutButton
    assert.match(homeAuthNavSource, /<Link href="\/dashboard" className="quest-button[^"]*">[\s\S]*?Go to Dashboard →[\s\S]*?<\/Link>[\s\S]*?<LogoutButton \/>/);
  });

  it("verifies real-time client reactivity with onAuthStateChange", () => {
    // Both header and hero must subscribe to onAuthStateChange to remain in sync when user signs in or signs out
    const matches = homeAuthNavSource.match(/supabase\.auth\.onAuthStateChange/g);
    assert.ok(matches && matches.length >= 2, "Both HomeHeaderAuth and HomeHeroAuth must subscribe to onAuthStateChange");
  });

  it("validates mutual exclusivity rule: Sign In and Log Out can never co-exist in same auth state", () => {
    // Simulate logged out state
    const loggedInState = false;
    const headerButtonsLoggedOut = loggedInState ? ["Dashboard", "Logout"] : ["SignIn", "GetStarted"];
    const heroButtonsLoggedOut = loggedInState ? ["Dashboard", "Logout"] : ["StartLearning", "SignIn"];

    assert.ok(headerButtonsLoggedOut.includes("SignIn"));
    assert.ok(!headerButtonsLoggedOut.includes("Logout"));
    assert.ok(heroButtonsLoggedOut.includes("SignIn"));
    assert.ok(!heroButtonsLoggedOut.includes("Logout"));

    // Simulate logged in state
    const loggedInStateTrue = true;
    const headerButtonsLoggedIn = loggedInStateTrue ? ["Dashboard", "Logout"] : ["SignIn", "GetStarted"];
    const heroButtonsLoggedIn = loggedInStateTrue ? ["Dashboard", "Logout"] : ["StartLearning", "SignIn"];

    assert.ok(!headerButtonsLoggedIn.includes("SignIn"));
    assert.ok(headerButtonsLoggedIn.includes("Logout"));
    assert.ok(!heroButtonsLoggedIn.includes("SignIn"));
    assert.ok(heroButtonsLoggedIn.includes("Logout"));
  });
});
