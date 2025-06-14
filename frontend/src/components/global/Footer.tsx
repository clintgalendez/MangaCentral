import React from "react";
import { BookOpen, Github, Heart } from "lucide-react";

const Footer: React.FC = () => {
  return (
    <footer className="relative bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 text-white">
      {/* Glass overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-black/50 to-black/30 backdrop-blur-sm"></div>

      <div className="relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Brand Section */}
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center space-x-3 mb-6">
                <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-2 rounded-xl shadow-lg">
                  <BookOpen className="w-6 h-6 text-white" />
                </div>
                <span className="text-2xl font-bold">Manga Central</span>
              </div>
              <p className="text-gray-300 text-lg leading-relaxed mb-6 max-w-md">
                The ultimate platform for manga enthusiasts to organize their
                favorite series across all devices.
              </p>
              <div className="flex items-center space-x-4">
                <a
                  href="https://github.com/clintgalendez"
                  className="p-2 bg-white/10 backdrop-blur-sm rounded-lg hover:bg-white/20 transition-all duration-200 hover:scale-110"
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  <Github className="w-5 h-5" />
                </a>
              </div>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="border-t border-white/10 mt-12 pt-8 flex flex-col md:flex-row items-center justify-between">
            <p className="text-gray-400">
              © 2025 Clint's Online Gizmo's. All rights reserved.
            </p>
            <div className="flex items-center space-x-2 text-gray-400 mt-4 md:mt-0">
              <span>Made with</span>
              <Heart className="w-4 h-4 text-red-400" />
              <span>for manga lovers</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
