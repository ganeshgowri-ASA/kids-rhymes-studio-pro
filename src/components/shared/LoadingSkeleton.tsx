export function LoadingSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="space-y-4 animate-pulse">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="bg-white rounded-2xl p-6 border border-gray-100">
          <div className="h-4 bg-gray-200 rounded w-1/3 mb-3" />
          <div className="h-3 bg-gray-100 rounded w-2/3 mb-2" />
          <div className="h-3 bg-gray-100 rounded w-1/2" />
        </div>
      ))}
    </div>
  );
}

export function CardSkeleton() {
  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-100 animate-pulse">
      <div className="w-14 h-14 bg-gray-200 rounded-xl mb-4" />
      <div className="h-5 bg-gray-200 rounded w-2/3 mb-2" />
      <div className="h-3 bg-gray-100 rounded w-full" />
    </div>
  );
}
