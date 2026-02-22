import { SkeletonGroupProps, SkeletonProps } from '@/app/components/Skeleton/Skeleton.types';

export function Skeleton({ className = '' }: SkeletonProps) {
  return <div className={`animate-pulse bg-gray-200 rounded ${className}`} />;
}

export function SkeletonGroup({ rows = 3, variant = 'card' }: SkeletonGroupProps) {
  const items = Array.from({ length: rows }, (_, i) => i);

  if (variant === 'stats') {
    return (
      <div className="grid grid-cols-3 gap-4">
        {items.map((i) => (
          <div key={i} className="bg-white p-4 rounded-lg shadow">
            <Skeleton className="h-4 w-24 mb-2" />
            <Skeleton className="h-8 w-32" />
          </div>
        ))}
      </div>
    );
  }

  if (variant === 'table') {
    return (
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-4 border-b">
          <Skeleton className="h-6 w-48" />
        </div>
        {items.map((i) => (
          <div key={i} className="p-4 border-b flex gap-4">
            <Skeleton className="h-5 w-1/4" />
            <Skeleton className="h-5 w-1/4" />
            <Skeleton className="h-5 w-1/4" />
            <Skeleton className="h-5 w-1/4" />
          </div>
        ))}
      </div>
    );
  }

  if (variant === 'list') {
    return (
      <div className="space-y-2">
        {items.map((i) => (
          <div key={i} className="bg-white p-3 rounded-lg shadow flex justify-between">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-5 w-24" />
          </div>
        ))}
      </div>
    );
  }

  // Default: card
  return (
    <div className="space-y-3">
      {items.map((i) => (
        <div key={i} className="bg-white p-4 rounded-lg shadow">
          <Skeleton className="h-5 w-48 mb-2" />
          <Skeleton className="h-4 w-32 mb-2" />
          <Skeleton className="h-4 w-24" />
        </div>
      ))}
    </div>
  );
}
