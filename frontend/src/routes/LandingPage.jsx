import { useState } from "react";

import Navbar from "@/components/sections/landingpage/Navbar.jsx";
import Hero from "@/components/sections/landingpage/Hero.jsx";
import Footer from "@/components/sections/landingpage/Footer.jsx";
import LoginModal from "@/components/sections/landingpage/LoginModal";
import SignUpModal from "../components/sections/landingpage/SignUpModal";

export default function LandingPage() {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isSignUpOpen, setIsSignUpOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500">
      <Navbar
        setIsLoginOpen={setIsLoginOpen}
        setIsSignUpOpen={setIsSignUpOpen}
      />
      <Hero />
      <Footer />

      {isLoginOpen && (
        <LoginModal
          setIsLoginOpen={setIsLoginOpen}
          setIsSignUpOpen={setIsSignUpOpen}
        />
      )}
      {isSignUpOpen && (
        <SignUpModal
          setIsSignUpOpen={setIsSignUpOpen}
          setIsLoginOpen={setIsLoginOpen}
        />
      )}
    </div>
  );
}
