import { useEffect } from "react";
import { BrowserRouter, useNavigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { AppRouter } from "./router/AppRouter";
import type { Database } from "./lib/database.types";

export type Property = Database["public"]["Tables"]["properties"]["Row"];

function AuthHandler() {
  const { user, profile, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && user && profile) {
      console.log("👤 User logged in with profile:", profile);
      console.log("🔑 Profile is_admin:", profile.is_admin);

      const currentPath = window.location.pathname;
      console.log("📍 Current path:", currentPath);

      // Redirect authenticated users from auth pages to their appropriate dashboard
      if (currentPath === "/login" || currentPath === "/signup") {
        if (profile.is_admin) {
          console.log("🎯 Redirecting admin to admin dashboard");
          navigate("/admin", { replace: true });
        } else {
          console.log("👥 Redirecting user to user dashboard");
          navigate("/dashboard", { replace: true });
        }
      }
      // If user is on landing page and logged in, also redirect to dashboard
      else if (currentPath === "/") {
        if (profile.is_admin) {
          console.log("🎯 Redirecting admin from landing to admin dashboard");
          navigate("/admin", { replace: true });
        } else {
          console.log("👥 Redirecting user from landing to user dashboard");
          navigate("/dashboard", { replace: true });
        }
      }
    }
  }, [user, profile, loading, navigate]);

  return null;
}

function AppContent() {
  return (
    <>
      <AuthHandler />
      <AppRouter />
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </BrowserRouter>
  );
}
