export default function Loading() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="h-4 bg-white/[0.04] rounded-lg w-20" />
      <div className="h-9 bg-white/[0.04] rounded-lg w-48" />
      <div className="grid grid-cols-3 gap-4">
        <div className="h-24 bg-white/[0.04] rounded-2xl" />
        <div className="h-24 bg-white/[0.04] rounded-2xl" />
        <div className="h-24 bg-white/[0.04] rounded-2xl" />
      </div>
      <div className="h-64 bg-white/[0.04] rounded-2xl" />
    </div>
  );
}
