import type React from "react";
import MangaCard from "@/components/ui/MangaCard";

interface MangaItem {
  id: string | number;
  title: string;
  thumbnail: string;
  url?: string;
}

interface MangaGridProps {
  mangas: MangaItem[];
  onMangaClick?: (manga: MangaItem) => void;
  className?: string;
  emptyMessage?: string;
}

const MangaGrid: React.FC<MangaGridProps> = ({
  mangas,
  onMangaClick,
  className = "",
  emptyMessage = "No manga found",
}) => {
  if (mangas.length === 0) {
    return (
      <div
        className={`flex flex-col items-center justify-center py-16 ${className}`}
      >
        <div className="text-center">
          <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center">
            <svg
              className="w-12 h-12 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
              />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-600 mb-2">
            {emptyMessage}
          </h3>
          <p className="text-gray-500">
            Start adding your favorite manga to see them here
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6 ${className}`}
    >
      {mangas.map((manga) => (
        <MangaCard
          key={manga.id}
          title={manga.title}
          thumbnail={manga.thumbnail}
          url={manga.url}
          onClick={() => onMangaClick?.(manga)}
        />
      ))}
    </div>
  );
};

export default MangaGrid;
