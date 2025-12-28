export const PDFPanelSkeleton = () => {
  return (
    <div className="h-full flex flex-col bg-gray-50">
      <div className="border-b-2 px-6 py-4 flex justify-between items-center bg-white shadow-sm">
        <div className="flex items-center gap-3 min-w-0 flex-1 ml-8">
          <div className="w-9 h-9 bg-gray-200 rounded-lg animate-pulse ml-8" />
          <div className="flex-1 space-y-2">
            <div className="h-3 bg-gray-200 rounded w-48 animate-pulse" />
            <div className="h-2 bg-gray-200 rounded w-32 animate-pulse" />
          </div>
        </div>
      </div>

      <div className="flex-1 bg-gray-100 p-2">
        <div className="w-full h-full bg-gray-200 rounded-lg animate-pulse" />
      </div>
    </div>
  );
};