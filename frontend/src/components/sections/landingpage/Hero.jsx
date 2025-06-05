import { Button } from "@/components/ui/button";

export default function Hero() {
  return (
    <div className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto text-center">
        <div className="backdrop-blur-lg bg-white/10 rounded-3xl p-12 shadow-2xl border border-white/20">
          <h1
            className="text-5xl md:text-6xl font-bold text-white mb-6 drop-shadow-lg"
            style={{ fontFamily: "Frutiger, Arial, sans-serif" }}
          >
            Your Manga Universe,{" "}
            <span className="bg-gradient-to-r from-yellow-300 to-orange-400 bg-clip-text text-transparent">
              Centralized
            </span>
          </h1>
          <p
            className="text-xl text-white/90 mb-8 leading-relaxed"
            style={{ fontFamily: "Frutiger, Arial, sans-serif" }}
          >
            Having to bookmark a Manga from your browser and guessing what the
            thumbnail looks like? Manga Central brings all your bookmarks
            together with added thumbnails!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-gradient-to-r from-green-400 to-blue-500 hover:from-green-500 hover:to-blue-600 text-white shadow-xl text-lg px-8 py-4 rounded-2xl border-0"
              style={{ fontFamily: "Frutiger, Arial, sans-serif" }}
            >
              Get Started Free
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
