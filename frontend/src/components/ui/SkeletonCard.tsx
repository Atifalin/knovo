export default function SkeletonCard() {
  return (
    <div className="animate-pulse">
      <div className="aspect-[3/4] bg-gray-100" />
      <div className="mt-3 space-y-2">
        <div className="h-3 bg-gray-100 w-1/3 rounded" />
        <div className="h-4 bg-gray-100 w-3/4 rounded" />
        <div className="h-4 bg-gray-100 w-1/4 rounded" />
      </div>
    </div>
  );
}
