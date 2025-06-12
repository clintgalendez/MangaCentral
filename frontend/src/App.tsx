import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { ToastProvider, useToast } from "@/contexts/ToastContext";
import ToastContainer from "@/components/ui/ToastContainter";
import LandingPage from "@/routes/LandingPage";
import DashboardPage from "@/routes/DashboardPage";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

function AppContent() {
  const { toasts, removeToast } = useToast();
  const { isAuthenticated } = useAuth();

  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <Routes>
          {/* Public route - Landing page */}
          <Route 
            path="/" 
            element={
              isAuthenticated ? <Navigate to="/dashboard" replace /> : <LandingPage />
            } 
          />
          
          {/* Protected route - Dashboard */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />
          
          {/* Catch all route - redirect to appropriate page */}
          <Route
            path="*"
            element={
              <Navigate to={isAuthenticated ? "/dashboard" : "/"} replace />
            }
          />
        </Routes>
        <ToastContainer toasts={toasts} onRemoveToast={removeToast} />
      </div>
    </Router>
  );
}

function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <AppContent />
      </ToastProvider>
    </AuthProvider>
  );
}

export default App;