import type React from "react"
import { useState } from "react"
import LinkInput from "@/components/ui/LinkInput"
import { BookOpen, Sparkles, HelpCircle } from "lucide-react"

interface AddMangaFormProps {
  onAddManga: (url: string) => Promise<void>
  onShowSupportedSites: () => void
  className?: string
}

const AddMangaForm: React.FC<AddMangaFormProps> = ({ onAddManga, onShowSupportedSites, className = "" }) => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (url: string) => {
    setIsLoading(true)
    setError("")

    try {
      await onAddManga(url)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add manga")
      throw err // Re-throw to prevent input clearing
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className={`${className}`}>
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center space-x-3 mb-4">
          <div className="p-3 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-2xl">
            <BookOpen className="w-6 h-6 text-blue-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800">Add New Manga</h2>
        </div>
        <p className="text-gray-600 max-w-md mx-auto">
          Paste a link to your favorite manga and we'll automatically fetch the thumbnail and details
        </p>
      </div>

      {/* Form */}
      <div className="max-w-2xl mx-auto">
        <LinkInput
          onSubmit={handleSubmit}
          loading={isLoading}
          error={error}
          placeholder="https://example.com/manga/your-favorite-manga"
          className="mb-6"
        />

        {/* Tips */}
        <div className="bg-gradient-to-r from-blue-50/80 to-purple-50/80 backdrop-blur-sm border border-white/30 rounded-2xl p-6">
          <div className="flex items-start space-x-3">
            <div className="p-2 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-xl flex-shrink-0">
              <Sparkles className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-800 mb-2">Pro Tips</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• We'll automatically extract the title and thumbnail</li>
                <li>• Your bookmarks are saved securely in your account</li>
              </ul>

              {/* Supported Sites Button */}
              <button
                onClick={onShowSupportedSites}
                className="mt-4 inline-flex items-center space-x-2 text-sm text-blue-600 hover:text-blue-800 transition-colors duration-200"
              >
                <HelpCircle className="w-4 h-4" />
                <span>View supported manga sites</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AddMangaForm