function FeedPageSkeleton() {
  return (
    <div className="w-full flex gap-4 border-b pb-10 pt-6 border-[#777777]">
      {/* Avatar */}
      <div className="size-10 rounded-full bg-[#232525] animate-pulse shrink-0" />

      <div className="w-full flex flex-col">
        {/* Header */}
        <div className="flex justify-between mb-2">
          <div className="flex gap-2 items-center">
            <div className="h-4 w-32 bg-[#232525] rounded animate-pulse" />
            <div className="h-4 w-12 bg-[#232525] rounded animate-pulse" />
          </div>
          <div className="flex gap-4 items-center">
            <div className="h-5 w-16 bg-[#232525] rounded-lg animate-pulse" />
            <div className="h-4 w-4 bg-[#232525] rounded animate-pulse" />
            <div className="h-4 w-4 bg-[#232525] rounded animate-pulse" />
          </div>
        </div>

        {/* Body Text */}
        <div className="w-full mb-4 flex flex-col gap-2 pt-2">
          <div className="h-4 w-full bg-[#232525] rounded animate-pulse" />
          <div className="h-4 w-5/6 bg-[#232525] rounded animate-pulse" />
        </div>

        {/* Footer Actions (Likes/Comments) */}
        <div className="w-full flex gap-8 pt-1">
          <div className="h-6 w-12 bg-[#232525] rounded animate-pulse" />
          <div className="h-6 w-12 bg-[#232525] rounded animate-pulse" />
        </div>
      </div>
    </div>
  );
}

export default FeedPageSkeleton;
