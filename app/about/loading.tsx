export default function AboutLoading() {
  return (
    <>
      <div className="bg-foreground pt-32 pb-16 px-6">
        <div className="container-site">
          <div className="h-4 w-20 bg-white/10 rounded mb-4 animate-pulse" />
          <div className="h-10 w-1/3 bg-white/10 rounded animate-pulse" />
        </div>
      </div>
      <div className="py-16 px-6">
        <div className="container-site">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 animate-pulse">
            <div className="aspect-[3/4] bg-border/40 rounded" />
            <div className="space-y-4">
              <div className="h-8 w-3/4 bg-border rounded" />
              <div className="h-4 w-full bg-border/60 rounded" />
              <div className="h-4 w-full bg-border/60 rounded" />
              <div className="h-4 w-2/3 bg-border/60 rounded" />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
