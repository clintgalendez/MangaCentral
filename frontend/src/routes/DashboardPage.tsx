import React, { useState } from "react";
import Navigation from "@/components/dashboardpage/Navigation";
import AddMangaForm from "@/components/dashboardpage/AddMangaForm";
import { useToast } from "@/contexts/ToastContext";

const DashboardPage: React.FC = () => {
  const { success, error } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const handleAddManga = async (url: string): Promise<void> => {
    setIsLoading(true);

    try {
      // TODO: Replace with actual API call
      // const response = await addManga({ url });

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Mock validation
      if (!url.includes("http")) {
        throw new Error("Please enter a valid URL");
      }

      success({
        title: "Manga Added Successfully!",
        message: "Your manga has been added to your collection.",
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

  return (
    <div className="min-h-screen">
      <Navigation />

      <main className="pt-20 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Add Manga Form Section */}
          <section className="mb-16">
            <div className="bg-white/80 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl p-8 md:p-12">
              <AddMangaForm onAddManga={handleAddManga} className="w-full" />
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default DashboardPage;
