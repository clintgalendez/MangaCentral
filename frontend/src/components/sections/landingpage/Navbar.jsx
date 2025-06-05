import { Button } from "@/components/ui/button"
import { BookOpen } from "lucide-react"

export default function Navbar() {
  return (
    <nav className="backdrop-blur-md bg-white/20 border-b border-white/30 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <BookOpen className="h-8 w-8 text-white mr-3" />
            <span className="text-2xl font-bold text-white" style={{ fontFamily: "Frutiger, Arial, sans-serif" }}>
              Manga Central
            </span>
          </div>
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              className="text-white hover:bg-white/20 backdrop-blur-sm border border-white/30"
              style={{ fontFamily: "Frutiger, Arial, sans-serif" }}
            >
              Login
            </Button>
            <Button
              className="bg-gradient-to-r from-orange-400 to-pink-500 hover:from-orange-500 hover:to-pink-600 text-white shadow-lg border-0"
              style={{ fontFamily: "Frutiger, Arial, sans-serif" }}
            >
              Sign Up
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}

