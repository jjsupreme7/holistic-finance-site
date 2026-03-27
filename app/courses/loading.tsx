export default function CoursesLoading() {
  return (
    <>
      <div className="bg-foreground pt-32 pb-16 px-6">
        <div className="container-site">
          <div className="h-4 w-24 bg-white/10 rounded mb-4 animate-pulse" />
          <div className="h-10 w-2/3 bg-white/10 rounded animate-pulse" />
        </div>
      </div>
      <div className="py-16 px-6">
        <div className="container-site grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="border border-border animate-pulse">
              <div className="h-48 bg-border/40" />
              <div className="p-6 space-y-3">
                <div className="h-3 w-20 bg-border rounded" />
                <div className="h-6 w-3/4 bg-border rounded" />
                <div className="h-4 w-full bg-border/60 rounded" />
                <div className="h-4 w-2/3 bg-border/60 rounded" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
