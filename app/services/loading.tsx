export default function ServicesLoading() {
  return (
    <>
      <div className="bg-foreground pt-32 pb-16 px-6">
        <div className="container-site">
          <div className="h-4 w-24 bg-white/10 rounded mb-4 animate-pulse" />
          <div className="h-10 w-1/2 bg-white/10 rounded animate-pulse" />
        </div>
      </div>
      <div className="py-16 px-6">
        <div className="container-site max-w-[800px] mx-auto">
          <div className="border border-border p-10 animate-pulse">
            <div className="h-8 w-2/3 bg-border rounded mx-auto mb-4" />
            <div className="h-4 w-3/4 bg-border/60 rounded mx-auto mb-8" />
            <div className="flex justify-center gap-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-10 w-28 bg-border rounded" />
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
