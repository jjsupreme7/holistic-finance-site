export default function ToolsLoading() {
  return (
    <>
      <div className="bg-foreground pt-32 pb-16 px-6">
        <div className="container-site">
          <div className="h-4 w-24 bg-white/10 mb-4 animate-pulse" />
          <div className="h-10 w-1/2 bg-white/10 animate-pulse" />
        </div>
      </div>
      <div className="py-20 px-6">
        <div className="container-site">
          <div className="text-center mb-12 animate-pulse">
            <div className="h-4 w-16 bg-border mx-auto mb-4" />
            <div className="h-8 w-64 bg-border mx-auto mb-3" />
            <div className="h-4 w-96 bg-border/60 mx-auto" />
          </div>
          <div className="grid md:grid-cols-2 gap-8 max-w-[1000px] mx-auto animate-pulse">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="border border-border p-8">
                <div className="h-8 w-8 bg-border mb-4" />
                <div className="h-6 w-3/4 bg-border mb-3" />
                <div className="h-4 w-full bg-border/60 mb-2" />
                <div className="h-4 w-2/3 bg-border/60" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
