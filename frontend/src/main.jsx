// filepath: frontend/src/main.jsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "@/App.jsx";
import LandingPage from "@/routes/LandingPage.jsx"; // Import your LandingPage
import DashboardPage from "@/routes/DashboardPage.jsx"; // Import your DashboardPage

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        index: true, // This makes LandingPage the default for the "/" path
        element: <LandingPage />,
      },
      {
        path: "dashboard",
        element: <DashboardPage />,
      },
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
