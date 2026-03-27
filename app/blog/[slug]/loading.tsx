export default function BlogPostLoading() {
  return (
    <>
      <div className="bg-foreground pt-32 pb-16 px-6">
        <div className="container-site">
          <div className="h-4 w-32 bg-white/10 rounded mb-4 animate-pulse" />
          <div className="h-10 w-2/3 bg-white/10 rounded animate-pulse" />
        </div>
      </div>
      <div className="py-16 px-6">
        <div className="max-w-[720px] mx-auto space-y-4 animate-pulse">
          <div className="h-4 w-full bg-border rounded" />
          <div className="h-4 w-5/6 bg-border rounded" />
          <div className="h-4 w-full bg-border rounded" />
          <div className="h-4 w-4/6 bg-border rounded" />
          <div className="h-8 w-1/3 bg-border rounded mt-8" />
          <div className="h-4 w-full bg-border rounded" />
          <div className="h-4 w-5/6 bg-border rounded" />
          <div className="h-4 w-3/4 bg-border rounded" />
        </div>
      </div>
    </>
  );
}
