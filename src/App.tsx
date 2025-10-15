import { useState, useEffect } from "react";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { Login } from "./components/Login";
import { Signup } from "./components/Signup";
import { LandingPage } from "./pages/LandingPage";
import { UserDashboard } from "./pages/UserDashboard";
import { AdminDashboard } from "./pages/AdminDashboard";
import { PropertyDetail } from "./pages/PropertyDetail";
import { SearchResults } from "./pages/SearchResults";
import { UserInquiries } from "./pages/UserInquiries";
import { AdminPropertyForm } from "./pages/AdminPropertyForm";
import { AdminInquiries } from "./pages/AdminInquiries";
import type { Database } from "./lib/database.types";

export type Property = Database["public"]["Tables"]["properties"]["Row"];

type Page =
  | { type: "landing" }
  | { type: "login" }
  | { type: "signup" }
  | { type: "user-dashboard" }
  | { type: "admin-dashboard" }
  | { type: "property-detail"; property: Property }
  | { type: "search-results"; query: string }
  | { type: "user-inquiries" }
  | { type: "admin-property-form"; property?: Property | null }
  | { type: "admin-inquiries" };

function AppContent() {
  const { user, profile, loading } = useAuth();
  const [page, setPage] = useState<Page>({ type: "landing" });

  useEffect(() => {
    console.log("🔄 App useEffect triggered:", {
      user: !!user,
      profile,
      loading,
    });

    if (!loading && user && profile) {
      console.log("👤 User logged in with profile:", profile);
      console.log("🔑 Profile is_admin:", profile.is_admin);

      if (profile.is_admin) {
        console.log("🎯 Redirecting to admin dashboard");
        setPage({ type: "admin-dashboard" });
      } else {
        console.log("👥 Redirecting to user dashboard");
        setPage({ type: "user-dashboard" });
      }
    } else if (
      !loading &&
      !user &&
      page.type !== "landing" &&
      page.type !== "login" &&
      page.type !== "signup"
    ) {
      console.log("🚪 No user, redirecting to landing");
      setPage({ type: "landing" });
    }
  }, [user, profile, loading]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    if (page.type === "signup") {
      return (
        <Signup
          onSwitchToLogin={() => setPage({ type: "login" })}
          onSuccess={() => setPage({ type: "login" })}
        />
      );
    }
    if (page.type === "login") {
      return (
        <Login
          onSwitchToSignup={() => setPage({ type: "signup" })}
          onSuccess={() => {
            if (profile?.is_admin) {
              setPage({ type: "admin-dashboard" });
            } else {
              setPage({ type: "user-dashboard" });
            }
          }}
        />
      );
    }
    if (page.type === "property-detail") {
      return (
        <PropertyDetail
          property={page.property}
          onBack={() => setPage({ type: "landing" })}
        />
      );
    }
    return (
      <LandingPage
        onLogin={() => setPage({ type: "login" })}
        onSignup={() => setPage({ type: "signup" })}
        onViewProperty={(property) =>
          setPage({ type: "property-detail", property })
        }
      />
    );
  }

  if (profile?.is_admin) {
    switch (page.type) {
      case "admin-property-form":
        return (
          <AdminPropertyForm
            property={page.property}
            onBack={() => setPage({ type: "admin-dashboard" })}
            onSuccess={() => setPage({ type: "admin-dashboard" })}
          />
        );
      case "admin-inquiries":
        return (
          <AdminInquiries onBack={() => setPage({ type: "admin-dashboard" })} />
        );
      default:
        return (
          <AdminDashboard
            onAddProperty={() => setPage({ type: "admin-property-form" })}
            onEditProperty={(property: Property) =>
              setPage({ type: "admin-property-form", property })
            }
            onViewInquiries={() => setPage({ type: "admin-inquiries" })}
          />
        );
    }
  }

  switch (page.type) {
    case "property-detail":
      return (
        <PropertyDetail
          property={page.property}
          onBack={() => setPage({ type: "user-dashboard" })}
        />
      );
    case "search-results":
      return (
        <SearchResults
          query={page.query}
          onBack={() => setPage({ type: "user-dashboard" })}
          onViewProperty={(property: Property) =>
            setPage({ type: "property-detail", property })
          }
        />
      );
    case "user-inquiries":
      return (
        <UserInquiries onBack={() => setPage({ type: "user-dashboard" })} />
      );
    default:
      return (
        <UserDashboard
          onViewProperty={(property: Property) =>
            setPage({ type: "property-detail", property })
          }
          onSearch={(query: string) =>
            setPage({ type: "search-results", query })
          }
          onViewInquiries={() => setPage({ type: "user-inquiries" })}
        />
      );
  }
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
