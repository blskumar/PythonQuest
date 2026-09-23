import Link from "next/link";

export function BrandLogo({ href = "/" }: { href?: string }) {
  return (
    <Link href={href} className="brand-logo" aria-label="Python Quest home">
      <span className="brand-mark" aria-hidden="true">PQ</span>
      <span className="brand-wordmark">Python <strong>Quest</strong></span>
    </Link>
  );
}
