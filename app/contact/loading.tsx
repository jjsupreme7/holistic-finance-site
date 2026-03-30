export default function ContactLoading() {
  return (
    <>
      <div className="bg-foreground pt-32 pb-16 px-6">
        <div className="container-site">
          <div className="h-4 w-24 bg-white/10 mb-4 animate-pulse" />
          <div className="h-10 w-2/3 bg-white/10 animate-pulse" />
        </div>
      </div>
      <div className="py-20 px-6">
        <div className="container-site">
          <div className="grid grid-cols-1 md:grid-cols-[1fr_380px] gap-10">
            <div className="border border-border p-8 animate-pulse">
              <div className="h-6 w-48 bg-border mb-6" />
              <div className="space-y-5">
                <div className="grid grid-cols-2 gap-5">
                  <div className="h-12 bg-border/60" />
                  <div className="h-12 bg-border/60" />
                </div>
                <div className="h-12 bg-border/60" />
                <div className="h-12 bg-border/60" />
                <div className="h-24 bg-border/60" />
              </div>
            </div>
            <div className="border border-border p-8 animate-pulse">
              <div className="h-6 w-32 bg-border mb-6" />
              <div className="space-y-5">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="w-10 h-10 bg-border" />
                    <div className="flex-1 h-4 bg-border/60" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
