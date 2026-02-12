export default function Loading() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="h-8 bg-white/[0.04] rounded-lg w-32" />
      <div className="h-10 bg-white/[0.04] rounded-lg" />
      <div className="grid grid-cols-4 gap-3">
        {Array(8).fill(0).map((_, i) => <div key={i} className="h-24 bg-white/[0.04] rounded-xl" />)}
      </div>
    </div>
  );
}
