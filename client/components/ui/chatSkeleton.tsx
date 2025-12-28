import { UserButton } from "@clerk/nextjs";

export const ChatSkeleton = () => {
  return (
    <div className="h-full flex flex-col bg-linear-to-b from-gray-50 to-white">
      {/* Header */}
      <div className="border-b-2 bg-white shadow-sm px-6 py-4">
        <div className="h-5 bg-gray-200 rounded w-32 animate-pulse mb-2" />
        <div className="h-3 bg-gray-200 rounded w-48 animate-pulse" />

        <div className="fixed top-7 right-6 z-40">
          <UserButton
            appearance={{
              elements: {
                avatarBox: "w-8 h-8",
              },
            }}
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        <div className="flex justify-end">
          <div className="w-80 h-16 bg-blue-200 rounded-2xl animate-pulse" />
        </div>

        <div className="flex justify-start">
          <div className="w-full max-w-3xl space-y-3">
            <div className="h-24 bg-gray-200 rounded-2xl animate-pulse" />
            <div className="h-16 bg-gray-200 rounded-xl animate-pulse" />
          </div>
        </div>

        <div className="flex justify-end">
          <div className="w-96 h-12 bg-blue-200 rounded-2xl animate-pulse" />
        </div>

        <div className="flex justify-start">
          <div className="w-full max-w-3xl">
            <div className="h-20 bg-gray-200 rounded-2xl animate-pulse" />
          </div>
        </div>
      </div>

      <div className="border-t-2 bg-white shadow-lg px-6 py-4">
        <div className="flex gap-3 max-w-4xl mx-auto">
          <div className="flex-1 h-12 bg-gray-200 rounded-xl animate-pulse" />
          <div className="w-20 h-12 bg-gray-200 rounded-xl animate-pulse" />
        </div>
      </div>
    </div>
  );
};