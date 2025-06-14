import React, { useState, useEffect, useCallback } from "react";
import Navigation from "@/components/dashboardpage/Navigation";
import AddMangaForm from "@/components/dashboardpage/AddMangaForm";
import MangaGrid from "@/components/ui/MangaGrid";
import MangaCardSkeleton from "@/components/ui/MangaCardSkeleton";
import SupportedSitesModal from "@/components/dashboardpage/SupportedSitesModal"
import Footer from "@/components/global/Footer";
import { useToast } from "@/contexts/ToastContext";
import { mangaApi } from "@/services/MangaBookmarkService";

interface MangaItem {
  id: string | number;
  title: string;
  thumbnail: string;
  url?: string;
}

const DashboardPage: React.FC = () => {
  const { success, error, info } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [mangaList, setMangaList] = useState<MangaItem[]>([]);
  const [isLoadingList, setIsLoadingList] = useState(true);
  const [showSupportedSites, setShowSupportedSites] = useState(false)

  // Load manga list on component mount
  useEffect(() => {
    loadMangaList();
  }, []);

    const loadMangaList = async () => {
    try {
      setIsLoadingList(true);
      const response = await mangaApi.getMangaList();
      
      // Fix: Check for results property instead of treating response as array
      if (response && response.results && Array.isArray(response.results)) {
        const formattedManga = response.results.map((manga: any) => {
          
          return {
            id: manga.id,
            title: manga.title,
            // Use thumbnail_url primarily (should be local when available)
            thumbnail: manga.thumbnail_url || '/placeholder.svg',
            url: manga.url
          };
        });
        setMangaList(formattedManga);
      }
    } catch (err) {
      console.error("Failed to load manga list:", err);
    } finally {
      setIsLoadingList(false);
    }
  };

  // Polling helper
  const pollTaskCompletion = async (taskId: string, interval = 2000, timeout = 30000) => {
    const start = Date.now();
    while (true) {
      const statusResp = await mangaApi.getTaskStatus(taskId);
      if (statusResp.status === "SUCCESS") return;
      if (statusResp.status === "FAILURE") throw new Error("Failed to add manga (scraping failed).");
      if (Date.now() - start > timeout) throw new Error("Timed out while adding manga.");
      await new Promise(res => setTimeout(res, interval));
    }
  };

  const handleAddManga = async (url: string): Promise<void> => {
    setIsLoading(true);

    try {
      // Step 1: Start add, get task_id
      const addResponse = await mangaApi.addManga(url);

      // If the backend returns a task_id, scraping is in progress
      if ('task_id' in addResponse) {
        info({
          title: "Adding Manga...",
          message: "We're fetching manga details. This may take a few seconds.",
        });

        // Step 2: Poll for task completion
        await pollTaskCompletion(addResponse.task_id);

        // Step 3: Reload manga list
        await loadMangaList();

        success({
          title: "Manga Added!",
          message: "Your manga has been added to your collection.",
        });
      } else {
        // If the backend returns the manga directly (already exists), add it immediately
        const mangaItem: MangaItem = {
          id: addResponse.id,
          title: addResponse.title,
          thumbnail: addResponse.thumbnail_url || addResponse.thumbnail || '/placeholder.svg',
          url: addResponse.url,
        };
        setMangaList(prev => [mangaItem, ...prev]);
        success({
          title: "Manga Added Successfully!",
          message: `"${addResponse.title}" has been added to your collection.`,
        });
      }
    } catch (err) {
      const isDev = import.meta.env.MODE === "development";
      const errorMessage =
        isDev
          ? err instanceof Error
            ? err.message
            : "Failed to add manga"
          : "Failed to add manga. Please try again.";
      error({
        title: "Error Adding Manga",
        message: errorMessage,
      });
      throw err; // Re-throw to prevent form clearing
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteManga = useCallback(async (manga: MangaItem) => {
    if (!window.confirm(`Delete "${manga.title}" from your collection?`)) return;
    try {
      await mangaApi.deleteManga(String(manga.id));
      setMangaList(prev => prev.filter(item => item.id !== manga.id));
      success({
        title: "Manga Deleted",
        message: `"${manga.title}" has been removed from your collection.`,
      });
    } catch (err) {
      const isDev = import.meta.env.MODE === "development";
      const errorMessage =
        isDev
          ? err instanceof Error
            ? err.message
            : "Failed to delete manga"
          : "Failed to delete manga. Please try again.";
      error({
        title: "Error Deleting Manga",
        message: errorMessage,
      });
    }
  }, [setMangaList, success, error]);

  const handleMangaClick = useCallback((manga: MangaItem) => {
    if (manga.url) {
      window.open(manga.url, "_blank", "noopener,noreferrer");
    }
  }, []);

  const openSupportedSitesModal = () => {
    setShowSupportedSites(true)
  }

  const closeSupportedSitesModal = () => {
    setShowSupportedSites(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Navigation />

      <main className="pt-20 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Add Manga Form Section */}
          <section className="mb-16">
            <div className="bg-white/80 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl p-8 md:p-12">
              <AddMangaForm
                onAddManga={handleAddManga}
                onShowSupportedSites={openSupportedSitesModal}
                className="w-full"
              />
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
                onMangaDelete={handleDeleteManga}
                emptyMessage="No manga in your collection yet"
                className="animate-fade-in"
              />
            )}
          </section>
        </div>
      </main>

      <Footer />
      
      {/* Supported Sites Modal */}
      <SupportedSitesModal isOpen={showSupportedSites} onClose={closeSupportedSitesModal} />
    </div>
  );
};

export default DashboardPage;