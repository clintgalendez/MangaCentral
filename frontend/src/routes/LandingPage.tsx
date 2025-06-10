import React, { useState } from 'react';
import Navigation from '@/components/landingpage/Navigation';
import Hero from '@/components/landingpage/Hero';
import Footer from '@/components/landingpage/Footer';
import LoginModal from '@/components/landingpage/LoginModal';
import SignupModal from '@/components/landingpage/SignUpModal'; // Corrected import name to match file

const LandingPage: React.FC = () => {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isSignupModalOpen, setIsSignupModalOpen] = useState(false); // State for SignupModal

  const openLoginModal = () => setIsLoginModalOpen(true);
  const closeLoginModal = () => setIsLoginModalOpen(false);

  const openSignupModal = () => setIsSignupModalOpen(true);
  const closeSignupModal = () => setIsSignupModalOpen(false);

  const switchToSignup = () => {
    closeLoginModal();
    openSignupModal();
  };

  const switchToLogin = () => {
    closeSignupModal();
    openLoginModal();
  };

  return (
    <>
      <Navigation onLoginClick={openLoginModal} onSignUpClick={openSignupModal} /> {/* Pass onSignUpClick */}
      <Hero />
      <Footer />
      <LoginModal 
        isOpen={isLoginModalOpen} 
        onClose={closeLoginModal} 
        onSwitchToSignup={switchToSignup} 
      />
      <SignupModal 
        isOpen={isSignupModalOpen} 
        onClose={closeSignupModal} 
        onSwitchToLogin={switchToLogin} 
      />
    </>
  );
};

export default LandingPage;