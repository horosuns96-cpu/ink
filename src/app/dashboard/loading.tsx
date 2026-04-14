export default function DashboardLoading() {
  return (
    <div className="relative pt-24 pb-16 px-4 animate-pulse">
      <div className="relative z-10 w-full max-w-[1600px] mx-auto space-y-10">
        <div className="flex justify-between items-end">
          <div className="space-y-3">
            <div className="h-12 w-64 rounded-2xl bg-white/5" />
            <div className="h-4 w-48 rounded-xl bg-white/5" />
          </div>
          <div className="h-10 w-28 rounded-full bg-white/5" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[0, 1, 2].map(i => (
            <div key={i} className="p-6 rounded-3xl bg-neutral-900 border border-white/5 space-y-3">
              <div className="h-3 w-24 rounded-lg bg-white/5" />
              <div className="h-8 w-32 rounded-xl bg-white/5" />
            </div>
          ))}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {[0, 1, 2, 3].map(i => (
            <div key={i} className="p-6 rounded-3xl bg-neutral-900 border border-white/5 space-y-4 h-56">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-white/5" />
                <div className="space-y-2">
                  <div className="h-4 w-24 rounded-lg bg-white/5" />
                  <div className="h-3 w-16 rounded-lg bg-white/5" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="h-14 rounded-2xl bg-white/5" />
                <div className="h-14 rounded-2xl bg-white/5" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
