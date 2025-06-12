import type React from "react";

interface MangaCardSkeletonProps {
  count?: number;
  className?: string;
}

const MangaCardSkeleton: React.FC<MangaCardSkeletonProps> = ({
  count = 6,
  className = "",
}) => {
  return (
    <div
      className={`grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6 ${className}`}
    >
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="bg-white/90 backdrop-blur-xl border border-white/20 rounded-2xl shadow-lg overflow-hidden animate-pulse"
        >
          {/* Thumbnail Skeleton */}
          <div className="aspect-[3/4] bg-gradient-to-br from-gray-200 to-gray-300 rounded-t-2xl" />

          {/* Title Skeleton */}
          <div className="p-4">
            <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded mb-2" />
            <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-3/4" />
          </div>
        </div>
      ))}
    </div>
  );
};

export default MangaCardSkeleton;
