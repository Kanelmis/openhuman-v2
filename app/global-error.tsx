'use client';

export default function GlobalError({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <html>
      <body className="min-h-screen bg-surface-950 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-red-400 mb-4">Something broke</h1>
          <p className="text-surface-400 mb-8">{error.message || 'An unexpected error occurred'}</p>
          <button onClick={reset} className="px-6 py-3 bg-neon-500 text-surface-950 rounded-xl font-semibold hover:bg-neon-400 transition-colors cursor-pointer">
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}
