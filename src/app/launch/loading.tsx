export default function LaunchLoading() {
  return (
    <div className="min-h-screen pt-28 pb-16 px-4 sm:px-6 animate-pulse">
      <div className="max-w-[1600px] mx-auto">
        <div className="mb-10 space-y-3">
          <div className="h-12 w-72 rounded-2xl bg-white/5" />
          <div className="h-4 w-80 rounded-xl bg-white/5" />
        </div>
        <div className="grid grid-cols-1 xl:grid-cols-5 gap-4">
          <div className="xl:col-span-3 rounded-3xl bg-neutral-900 border border-white/5 p-8 space-y-6 h-[480px]">
            {[0, 1, 2].map(i => (
              <div key={i} className="space-y-2">
                <div className="h-3 w-20 rounded-lg bg-white/5" />
                <div className="h-12 rounded-2xl bg-white/5" />
              </div>
            ))}
            <div className="h-14 rounded-2xl bg-purple-500/10 mt-4" />
          </div>
          <div className="xl:col-span-2 rounded-3xl bg-neutral-900 border border-white/5 h-[480px]" />
        </div>
      </div>
    </div>
  );
}
