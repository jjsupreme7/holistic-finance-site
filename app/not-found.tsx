import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-6 bg-background">
      <div className="text-center max-w-lg">
        <p className="label text-text-muted mb-4">404</p>
        <h1 className="heading-lg font-extralight text-foreground mb-4">Page Not Found</h1>
        <p className="text-text-secondary mb-8">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <Link
          href="/"
          className="inline-block bg-accent text-foreground font-medium py-3.5 px-8 text-sm uppercase tracking-[0.15em] no-underline transition-colors hover:bg-accent-dark"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
}
