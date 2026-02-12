export default function Loading() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="h-8 bg-white/[0.04] rounded-lg w-32" />
      <div className="h-32 bg-white/[0.04] rounded-xl" />
      <div className="space-y-3">
        <div className="h-20 bg-white/[0.04] rounded-xl" />
        <div className="h-20 bg-white/[0.04] rounded-xl" />
      </div>
    </div>
  );
}
