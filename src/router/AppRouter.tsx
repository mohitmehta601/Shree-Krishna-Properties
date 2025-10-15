import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { LandingPage } from "../pages/LandingPage";
import { Login } from "../components/Login";
import { Signup } from "../components/Signup";
import { UserDashboard } from "../pages/UserDashboard";
import { AdminDashboard } from "../pages/AdminDashboard";
import { PropertyDetailWrapper } from "../pages/PropertyDetailWrapper";
import { SearchResultsWrapper } from "../pages/SearchResultsWrapper";
import { UserInquiries } from "../pages/UserInquiries";
import { AdminPropertyFormWrapper } from "../pages/AdminPropertyFormWrapper";
import { AdminInquiries } from "../pages/AdminInquiries";
import { ProtectedRoute } from "./ProtectedRoute.tsx";
import { AdminRoute } from "./AdminRoute.tsx";
import { LoadingSpinner } from "../components/LoadingSpinner.tsx";

export function AppRouter() {
  const { loading } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/property/:id" element={<PropertyDetailWrapper />} />
      <Route path="/search" element={<SearchResultsWrapper />} />

      {/* Protected user routes */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <UserDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/inquiries"
        element={
          <ProtectedRoute>
            <UserInquiries />
          </ProtectedRoute>
        }
      />

      {/* Protected admin routes */}
      <Route
        path="/admin"
        element={
          <AdminRoute>
            <AdminDashboard />
          </AdminRoute>
        }
      />
      <Route
        path="/admin/properties/new"
        element={
          <AdminRoute>
            <AdminPropertyFormWrapper />
          </AdminRoute>
        }
      />
      <Route
        path="/admin/properties/edit/:id"
        element={
          <AdminRoute>
            <AdminPropertyFormWrapper />
          </AdminRoute>
        }
      />
      <Route
        path="/admin/inquiries"
        element={
          <AdminRoute>
            <AdminInquiries />
          </AdminRoute>
        }
      />

      {/* Redirect fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
