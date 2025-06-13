import type React from "react"
import { ExternalLink, BookOpen, Trash2 } from "lucide-react"

interface MangaCardProps {
  id?: string | number
  title: string
  thumbnail: string
  url?: string
  onClick?: () => void
  onDelete?: () => void
  className?: string
}

const MangaCard: React.FC<MangaCardProps> = ({ title, thumbnail, url, onClick, onDelete, className = "" }) => {
  const handleClick = () => {
    if (onClick) {
      onClick()
    } else if (url) {
      window.open(url, "_blank", "noopener,noreferrer")
    }
  }

  // Add a function to handle delete button click
  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation() // Prevent triggering the card click
    if (onDelete) {
      onDelete()
    }
  }

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const target = e.target as HTMLImageElement
    console.error("Failed to load image:", target.src) // Add logging
    target.style.display = "none"
    const fallback = target.nextElementSibling as HTMLElement
    if (fallback) {
      fallback.classList.remove("hidden")
    }
  }

  return (
    <div
      className={`group relative bg-white/90 backdrop-blur-xl border border-white/20 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] cursor-pointer overflow-hidden ${className}`}
      onClick={handleClick}
    >
      {/* Thumbnail Container */}
      <div className="relative aspect-[3/4] overflow-hidden rounded-t-2xl bg-gradient-to-br from-gray-100 to-gray-200">
        {thumbnail && thumbnail !== "/placeholder.svg" ? (
          <>
            <img
              src={thumbnail || "/placeholder.svg"}
              alt={title}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              onError={handleImageError}
            />
            {/* Fallback placeholder - hidden by default */}
            <div className="hidden w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50">
              <div className="text-center">
                <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                <p className="text-xs text-gray-500 px-2 leading-tight">{title}</p>
              </div>
            </div>
          </>
        ) : (
          // Default placeholder when no thumbnail
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50">
            <div className="text-center">
              <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-2" />
              <p className="text-xs text-gray-500 px-2 leading-tight">{title}</p>
            </div>
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

        {/* Delete button - new addition */}
        {onDelete && (
          <div
            className="absolute top-3 left-3 p-2 bg-red-500/70 backdrop-blur-sm rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-red-600/90 hover:scale-110"
            onClick={handleDelete}
          >
            <Trash2 className="w-4 h-4 text-white" />
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
  )
}

export default MangaCard
