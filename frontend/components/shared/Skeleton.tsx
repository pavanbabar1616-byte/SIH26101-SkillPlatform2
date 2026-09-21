export function SkeletonCard() {
  return (
    <div className="glass rounded-2xl p-6 animate-pulse">
      <div className="h-4 bg-slate-700/60 rounded w-1/3 mb-3" />
      <div className="h-3 bg-slate-700/60 rounded w-2/3 mb-2" />
      <div className="h-3 bg-slate-700/60 rounded w-1/2" />
    </div>
  );
}

export function SkeletonList({ count = 3 }: { count?: number }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}