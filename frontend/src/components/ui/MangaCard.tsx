import type React from "react";
import { ExternalLink, BookOpen } from "lucide-react";

interface MangaCardProps {
  id?: string | number;
  title: string;
  thumbnail: string;
  url?: string;
  onClick?: () => void;
  className?: string;
}

const MangaCard: React.FC<MangaCardProps> = ({
  title,
  thumbnail,
  url,
  onClick,
  className = "",
}) => {
  const handleClick = () => {
    if (onClick) {
      onClick();
    } else if (url) {
      window.open(url, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <div
      className={`group relative bg-white/90 backdrop-blur-xl border border-white/20 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] cursor-pointer overflow-hidden ${className}`}
      onClick={handleClick}
    >
      {/* Thumbnail Container */}
      <div className="relative aspect-[3/4] overflow-hidden rounded-t-2xl bg-gradient-to-br from-gray-100 to-gray-200">
        {thumbnail ? (
          <img
            src={thumbnail || "/placeholder.svg"}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            onError={(e) => {
              // Fallback to placeholder if image fails to load
              const target = e.target as HTMLImageElement;
              target.src = `/placeholder.svg?height=400&width=300&text=${encodeURIComponent(
                title
              )}`;
            }}
          />
        ) : (
          // Placeholder when no thumbnail
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50">
            <BookOpen className="w-16 h-16 text-gray-400" />
          </div>
        )}

        {/* Overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* External link icon */}
        {url && (
          <div className="absolute top-3 right-3 p-2 bg-white/20 backdrop-blur-sm rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-white/30">
            <ExternalLink className="w-4 h-4 text-white" />
          </div>
        )}
      </div>

      {/* Title Section */}
      <div className="p-4">
        <h3 className="text-sm font-semibold text-gray-800 line-clamp-2 leading-tight group-hover:text-blue-600 transition-colors duration-200">
          {title}
        </h3>
      </div>

      {/* Glass morphism hover effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl pointer-events-none" />
    </div>
  );
};

export default MangaCard;
