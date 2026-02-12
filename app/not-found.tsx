import Link from 'next/link';
import { Button } from '@/components/ui';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-surface-950 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-7xl font-bold text-neon-400 mb-4">404</h1>
        <p className="text-surface-400 mb-8 text-lg">This page doesn&apos;t exist in the meatspace</p>
        <Link href="/">
          <Button variant="primary" size="lg">Go Home</Button>
        </Link>
      </div>
    </div>
  );
}
