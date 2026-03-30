export default function ShopLoading() {
  return (
    <>
      <div className="bg-foreground pt-32 pb-16 px-6">
        <div className="container-site">
          <div className="h-4 w-16 bg-white/10 mb-4 animate-pulse" />
          <div className="h-10 w-1/4 bg-white/10 animate-pulse" />
        </div>
      </div>
      <div className="py-16 px-6">
        <div className="container-site">
          <div className="border border-border overflow-hidden animate-pulse">
            <div className="grid grid-cols-1 md:grid-cols-2">
              <div className="h-72 bg-border/40" />
              <div className="p-10 space-y-4">
                <div className="h-4 w-24 bg-border" />
                <div className="h-8 w-1/2 bg-border" />
                <div className="h-8 w-20 bg-border" />
                <div className="h-4 w-full bg-border/60" />
                <div className="h-4 w-3/4 bg-border/60" />
                <div className="h-12 w-48 bg-border mt-4" />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="py-16 px-6 bg-muted">
        <div className="container-site">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-border animate-pulse">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-muted">
                <div className="h-64 bg-border/40" />
                <div className="p-6 space-y-3">
                  <div className="h-5 w-3/4 bg-border" />
                  <div className="h-4 w-full bg-border/60" />
                  <div className="h-10 w-full bg-border mt-4" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
