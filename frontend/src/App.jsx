import { Outlet } from "react-router-dom";
import { ToastProvider } from "@/contexts/ToastContext";
import "@/App.css";

function App() {
  return (
    <ToastProvider>
      <Outlet />
    </ToastProvider>
  );
}

export default App;