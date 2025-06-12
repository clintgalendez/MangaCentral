import React, { useState, useEffect } from "react";
import Navigation from "@/components/dashboardpage/Navigation";
import AddMangaForm from "@/components/dashboardpage/AddMangaForm";
import MangaGrid from "@/components/ui/MangaGrid";
import MangaCardSkeleton from "@/components/ui/MangaCardSkeleton";
import { useToast } from "@/contexts/ToastContext";
import { mangaApi } from "@/services/MangaBookmarkService";

interface MangaItem {
  id: string | number;
  title: string;
  thumbnail: string;
  url?: string;
}

const DashboardPage: React.FC = () => {
  const { success, error } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [mangaList, setMangaList] = useState<MangaItem[]>([]);
  const [isLoadingList, setIsLoadingList] = useState(true);

  // Load manga list on component mount
  useEffect(() => {
    loadMangaList();
  }, []);

    const loadMangaList = async () => {
    try {
      setIsLoadingList(true);
      const response = await mangaApi.getMangaList();
      console.log("API response for manga list:", response); // Check this log
      
      // Fix: Check for results property instead of treating response as array
      if (response && response.results && Array.isArray(response.results)) {
        const formattedManga = response.results.map((manga: any) => {
          console.log("Processing manga:", manga); // Add detailed logging
          console.log("Thumbnail fields:", {
            thumbnail: manga.thumbnail,
            thumbnail_url: manga.thumbnail_url
          });
          
          return {
            id: manga.id,
            title: manga.title,
            // Use thumbnail_url primarily (should be local when available)
            thumbnail: manga.thumbnail_url || '/placeholder.svg',
            url: manga.url
          };
        });
        console.log("Formatted manga data:", formattedManga);
        setMangaList(formattedManga);
      }
    } catch (err) {
      console.error("Failed to load manga list:", err);
    } finally {
      setIsLoadingList(false);
    }
  };

  const handleAddManga = async (url: string): Promise<void> => {
    setIsLoading(true);

    try {
      const newManga = await mangaApi.addManga(url);
      
      // Add the new manga to the list
      const mangaItem: MangaItem = {
        id: newManga.id,
        title: newManga.title,
        thumbnail: newManga.thumbnail_url || newManga.thumbnail || '/placeholder.svg',
        url: newManga.url
      };
      
      setMangaList(prev => [mangaItem, ...prev]);

      success({
        title: "Manga Added Successfully!",
        message: `"${newManga.title}" has been added to your collection.`,
      });
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to add manga";
      error({
        title: "Error Adding Manga",
        message: errorMessage,
      });
      throw err; // Re-throw to prevent form clearing
    } finally {
      setIsLoading(false);
    }
  };

  const handleMangaClick = (manga: MangaItem) => {
    if (manga.url) {
      window.open(manga.url, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Navigation />

      <main className="pt-20 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Add Manga Form Section */}
          <section className="mb-16">
            <div className="bg-white/80 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl p-8 md:p-12">
              <AddMangaForm onAddManga={handleAddManga} className="w-full" />
            </div>
          </section>

          {/* Manga Collection Section */}
          <section>
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-gray-800 mb-2">
                Your Manga Collection
              </h2>
              <p className="text-gray-600">
                {mangaList.length} manga{mangaList.length !== 1 ? 's' : ''} in your collection
              </p>
            </div>

            {isLoadingList ? (
              <MangaCardSkeleton count={12} />
            ) : (
              <MangaGrid
                mangas={mangaList}
                onMangaClick={handleMangaClick}
                emptyMessage="No manga in your collection yet"
                className="animate-fade-in"
              />
            )}
          </section>
        </div>
      </main>
    </div>
  );
};

export default DashboardPage;