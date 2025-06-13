import React, { useEffect, useState } from "react"
import { X, Globe, Check, ExternalLink } from "lucide-react"
import { mangaApi } from "@/services/MangaBookmarkService"

interface SupportedSite {
  name: string
  domain: string
  is_active: boolean
  description?: string
}

interface SupportedSitesModalProps {
  isOpen: boolean
  onClose: () => void
}

const SupportedSitesModal: React.FC<SupportedSitesModalProps> = ({ isOpen, onClose }) => {
  const [supportedSites, setSupportedSites] = useState<SupportedSite[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!isOpen) return
    setLoading(true)
    setError(null)
    mangaApi.getSupportedSites()
      .then((sites) => setSupportedSites(sites))
      .catch((err) => setError("Failed to load supported sites"))
      .finally(() => setLoading(false))
  }, [isOpen])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="bg-white/90 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="sticky top-0 z-10 bg-gradient-to-r from-blue-500/10 to-purple-500/10 p-6 border-b border-white/20">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-xl">
                  <Globe className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">Supported Manga Sites</h2>
                  <p className="text-gray-600 mt-1">Manga Central works with these popular manga reading platforms</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/50 rounded-lg transition-all duration-200 hover:scale-110"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            {loading ? (
              <div className="text-center text-gray-600">Loading...</div>
            ) : error ? (
              <div className="text-center text-red-600">{error}</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {supportedSites.map((site) => (
                  <div
                    key={site.domain}
                    className="bg-white/70 backdrop-blur-sm border border-white/30 rounded-xl p-4 hover:shadow-md transition-all duration-200"
                  >
                    <div className="flex items-start space-x-3">
                      <div className="p-2 bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg flex-shrink-0">
                        <Globe className="w-5 h-5 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h3 className="font-semibold text-gray-800">{site.name}</h3>
                          <div className="flex items-center space-x-1 text-green-600 text-sm">
                            <Check className="w-4 h-4" />
                            <span>Supported</span>
                          </div>
                        </div>
                        {site.description && <p className="text-sm text-gray-600 mt-1 mb-2">{site.description}</p>}
                        <a
                          href={`https://${site.domain}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center space-x-1 text-sm text-blue-600 hover:text-blue-800 transition-colors duration-200"
                        >
                          <span>Visit site</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Note */}
            <div className="mt-8 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-100/50">
              <div className="flex items-start space-x-3">
                <div className="p-2 bg-blue-100/50 rounded-lg">
                  <Check className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-800 mb-1">Don't see your favorite site?</h4>
                  <p className="text-sm text-gray-600">
                    We're constantly adding support for more manga sites. If your preferred site isn't listed, try
                    adding it anyway - it might still work! If not, please let us know and we'll consider adding support
                    for it in the future.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="bg-gradient-to-r from-blue-50/50 to-purple-50/50 p-4 border-t border-white/20 text-center">
            <button
              onClick={onClose}
              className="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-medium rounded-xl shadow-md hover:shadow-lg transition-all duration-200 hover:scale-105"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SupportedSitesModal