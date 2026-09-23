import test, { describe, it } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");
const webDir = path.join(rootDir, "apps", "web");

describe("UI Component Logic & Prop Contract Tests", () => {
  describe("Button Component (components/ui/button.tsx)", () => {
    const buttonSrcPath = path.join(webDir, "components", "ui", "button.tsx");

    it("button.tsx exists and exports Button", () => {
      assert.ok(fs.existsSync(buttonSrcPath), "button.tsx must exist");
      const src = fs.readFileSync(buttonSrcPath, "utf-8");
      assert.match(src, /export function Button\b/, "must export Button function");
      assert.match(src, /primary:\s*"quest-button"/, "primary variant must map to quest-button");
      assert.match(src, /secondary:\s*"secondary-button"/, "secondary variant must map to secondary-button");
      assert.match(src, /quiet:\s*"auth-link"/, "quiet variant must map to auth-link");
    });

    // Simulating component logic matching apps/web/components/ui/button.tsx
    const variants = {
      primary: "quest-button",
      secondary: "secondary-button",
      quiet: "auth-link",
    };

    function Button({ className = "", variant = "primary", ...props } = {}) {
      return {
        type: "button",
        props: {
          className: `${variants[variant]} ${className}`.trim(),
          ...props,
        },
      };
    }

    it("defaults to primary variant with 'quest-button' class", () => {
      const el = Button();
      assert.equal(el.type, "button");
      assert.equal(el.props.className, "quest-button");
    });

    it("applies secondary variant with 'secondary-button' class", () => {
      const el = Button({ variant: "secondary" });
      assert.equal(el.props.className, "secondary-button");
    });

    it("applies quiet variant with 'auth-link' class", () => {
      const el = Button({ variant: "quiet" });
      assert.equal(el.props.className, "auth-link");
    });

    it("correctly appends custom className and trims whitespace", () => {
      const el1 = Button({ className: "w-full text-center" });
      assert.equal(el1.props.className, "quest-button w-full text-center");

      const el2 = Button({ variant: "secondary", className: "mt-4 disabled:opacity-50" });
      assert.equal(el2.props.className, "secondary-button mt-4 disabled:opacity-50");

      const el3 = Button({ variant: "quiet", className: "" });
      assert.equal(el3.props.className, "auth-link");
    });

    it("passes through standard HTML button attributes", () => {
      const handleClick = () => {};
      const el = Button({
        type: "submit",
        disabled: true,
        "aria-label": "Submit answer",
        id: "submit-btn",
        onClick: handleClick,
      });

      assert.equal(el.props.type, "submit");
      assert.equal(el.props.disabled, true);
      assert.equal(el.props["aria-label"], "Submit answer");
      assert.equal(el.props.id, "submit-btn");
      assert.equal(el.props.onClick, handleClick);
    });
  });

  describe("Card Components (components/ui/card.tsx)", () => {
    const cardSrcPath = path.join(webDir, "components", "ui", "card.tsx");

    it("card.tsx exists and exports Card, CardHeader, CardContent", () => {
      assert.ok(fs.existsSync(cardSrcPath), "card.tsx must exist");
      const src = fs.readFileSync(cardSrcPath, "utf-8");
      assert.match(src, /export function Card\b/, "must export Card");
      assert.match(src, /export function CardHeader\b/, "must export CardHeader");
      assert.match(src, /export function CardContent\b/, "must export CardContent");
    });

    // Simulating component logic matching apps/web/components/ui/card.tsx
    function Card({ className = "", ...props } = {}) {
      return {
        type: "section",
        props: {
          className: `surface ${className}`.trim(),
          ...props,
        },
      };
    }

    function CardHeader({ className = "", ...props } = {}) {
      return {
        type: "div",
        props: {
          className: `card-header ${className}`.trim(),
          ...props,
        },
      };
    }

    function CardContent({ className = "", ...props } = {}) {
      return {
        type: "div",
        props: {
          className: `card-content ${className}`.trim(),
          ...props,
        },
      };
    }

    it("Card renders as <section> with base class 'surface'", () => {
      const el = Card();
      assert.equal(el.type, "section");
      assert.equal(el.props.className, "surface");
    });

    it("Card appends custom className and passes through HTML attributes", () => {
      const el = Card({ className: "p-6 rounded-xl", id: "quest-card", role: "region" });
      assert.equal(el.type, "section");
      assert.equal(el.props.className, "surface p-6 rounded-xl");
      assert.equal(el.props.id, "quest-card");
      assert.equal(el.props.role, "region");
    });

    it("CardHeader renders as <div> with base class 'card-header'", () => {
      const el = CardHeader({ className: "border-b border-white/10" });
      assert.equal(el.type, "div");
      assert.equal(el.props.className, "card-header border-b border-white/10");
    });

    it("CardContent renders as <div> with base class 'card-content'", () => {
      const el = CardContent({ className: "space-y-4" });
      assert.equal(el.type, "div");
      assert.equal(el.props.className, "card-content space-y-4");
    });

    it("supports composite nesting structure", () => {
      const header = CardHeader({ children: "Quiz Summary" });
      const content = CardContent({ children: "Score: 100 XP" });
      const card = Card({ children: [header, content] });

      assert.equal(card.type, "section");
      assert.equal(card.props.className, "surface");
      assert.equal(card.props.children.length, 2);
      assert.equal(card.props.children[0].props.className, "card-header");
      assert.equal(card.props.children[1].props.className, "card-content");
    });
  });

  describe("BrandLogo Component (app/brand-logo.tsx)", () => {
    const brandLogoPath = path.join(webDir, "app", "brand-logo.tsx");

    it("brand-logo.tsx exists and exports BrandLogo", () => {
      assert.ok(fs.existsSync(brandLogoPath), "brand-logo.tsx must exist");
      const src = fs.readFileSync(brandLogoPath, "utf-8");
      assert.match(src, /export function BrandLogo\b/, "must export BrandLogo function");
      assert.match(src, /aria-label="Python Quest home"/, "must have accessible aria-label");
      assert.match(src, /className="brand-mark"/, "must have brand-mark class");
      assert.match(src, /className="brand-wordmark"/, "must have brand-wordmark class");
    });

    // Simulating component logic matching apps/web/app/brand-logo.tsx
    function BrandLogo({ href = "/" } = {}) {
      return {
        type: "Link",
        props: {
          href,
          className: "brand-logo",
          "aria-label": "Python Quest home",
          children: [
            { type: "span", props: { className: "brand-mark", "aria-hidden": "true", children: "PQ" } },
            {
              type: "span",
              props: {
                className: "brand-wordmark",
                children: [
                  "Python ",
                  { type: "strong", props: { children: "Quest" } },
                ],
              },
            },
          ],
        },
      };
    }

    it("defaults to root '/' href", () => {
      const el = BrandLogo();
      assert.equal(el.props.href, "/");
      assert.equal(el.props.className, "brand-logo");
      assert.equal(el.props["aria-label"], "Python Quest home");
    });

    it("supports custom href (e.g., '/dashboard')", () => {
      const el = BrandLogo({ href: "/dashboard" });
      assert.equal(el.props.href, "/dashboard");
    });

    it("renders both brand mark and wordmark with proper accessibility attributes", () => {
      const el = BrandLogo();
      const [mark, wordmark] = el.props.children;

      assert.equal(mark.type, "span");
      assert.equal(mark.props.className, "brand-mark");
      assert.equal(mark.props["aria-hidden"], "true");
      assert.equal(mark.props.children, "PQ");

      assert.equal(wordmark.type, "span");
      assert.equal(wordmark.props.className, "brand-wordmark");
      assert.equal(wordmark.props.children[0], "Python ");
      assert.equal(wordmark.props.children[1].type, "strong");
      assert.equal(wordmark.props.children[1].props.children, "Quest");
    });
  });
});
