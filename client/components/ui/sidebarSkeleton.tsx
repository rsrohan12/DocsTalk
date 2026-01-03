"use client"

export const SidebarSkeleton = () => {
  return (
    <div className="p-4 space-y-2">
      {[...Array(6)].map((_, i) => (
        <div
          key={i}
          className="p-3 rounded-xl border-2 border-gray-200 animate-pulse"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-gray-200 rounded-lg" />
            <div className="flex-1 space-y-2">
              <div className="h-3 bg-gray-200 rounded w-3/4" />
              <div className="h-2 bg-gray-200 rounded w-1/2" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};