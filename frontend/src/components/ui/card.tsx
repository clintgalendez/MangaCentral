import { useState } from "react";
import { motion } from "framer-motion";

interface CardProps {
  title: string;
  imageUrl: string;
  onClick?: () => void;
  className?: string;
}

export default function Card({
  title,
  imageUrl,
  onClick,
  className = "",
}: CardProps) {
  const [isPressed, setIsPressed] = useState(false);

  const handleMouseDown = () => setIsPressed(true);
  const handleMouseUp = () => setIsPressed(false);
  const handleMouseLeave = () => setIsPressed(false);

  return (
    <motion.div
      className={`relative group cursor-pointer select-none ${className}`}
      onClick={onClick}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      {/* Main card container with glass effect */}
      <div
        className={`
        relative w-full h-80 sm:h-96 rounded-2xl overflow-hidden
        bg-gradient-to-br from-blue-400/20 via-purple-400/20 to-pink-400/20
        backdrop-blur-md border border-white/30
        shadow-2xl shadow-blue-500/20
        transition-all duration-300 ease-out
        ${
          isPressed
            ? "shadow-lg shadow-blue-500/30"
            : "hover:shadow-3xl hover:shadow-blue-500/30"
        }
        before:absolute before:inset-0 before:bg-gradient-to-br 
        before:from-white/10 before:via-transparent before:to-transparent
        before:pointer-events-none
      `}
      >
        {/* Glossy highlight effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-transparent pointer-events-none" />

        {/* Image container */}
        <div className="relative h-3/4 overflow-hidden">
          <img
            src={imageUrl || "/placeholder.svg"}
            alt={title}
            className="object-cover transition-transform duration-500 group-hover:scale-110"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />

          {/* Image overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

          {/* Glossy reflection on image */}
          <div className="absolute top-0 left-0 right-0 h-1/3 bg-gradient-to-b from-white/20 to-transparent opacity-60" />
        </div>

        {/* Title section with glass effect */}
        <div className="absolute bottom-0 left-0 right-0 h-1/4 p-4 sm:p-6">
          <div
            className="
            h-full flex items-center justify-center
            bg-gradient-to-r from-blue-600/80 via-purple-600/80 to-pink-600/80
            backdrop-blur-sm rounded-xl border border-white/20
            shadow-inner
          "
          >
            <h3
              className="
              text-white font-medium text-base sm:text-lg lg:text-xl
              text-center leading-tight tracking-wide
              drop-shadow-lg
              transition-all duration-300
              group-hover:text-blue-100
            "
            >
              {title}
            </h3>
          </div>
        </div>

        {/* Interactive glow effect */}
        <div
          className={`
          absolute inset-0 rounded-2xl pointer-events-none
          transition-opacity duration-300
          ${isPressed ? "opacity-100" : "opacity-0 group-hover:opacity-50"}
          bg-gradient-to-br from-blue-400/30 via-purple-400/30 to-pink-400/30
        `}
        />

        {/* Subtle inner shadow for depth */}
        <div className="absolute inset-0 rounded-2xl shadow-inner shadow-black/10 pointer-events-none" />
      </div>

      {/* Floating shadow */}
      <div
        className="
        absolute -bottom-2 left-2 right-2 h-4
        bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20
        blur-xl rounded-full
        transition-all duration-300
        group-hover:blur-2xl group-hover:scale-110
      "
      />
    </motion.div>
  );
}
