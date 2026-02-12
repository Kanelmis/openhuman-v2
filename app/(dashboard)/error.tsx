'use client';

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div className="text-center py-24">
      <h2 className="text-2xl font-bold text-red-400 mb-3">Something went wrong</h2>
      <p className="text-surface-400 mb-6">{error.message}</p>
      <button onClick={reset} className="px-5 py-2.5 bg-neon-500 text-surface-950 rounded-xl font-semibold hover:bg-neon-400 cursor-pointer">Try again</button>
    </div>
  );
}
