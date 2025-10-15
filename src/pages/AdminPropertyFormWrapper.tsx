import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import { AdminPropertyForm } from "./AdminPropertyForm";
import { LoadingSpinner } from "../components/LoadingSpinner";
import type { Property } from "../App";

export function AdminPropertyFormWrapper() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isEdit = Boolean(id);

  useEffect(() => {
    if (isEdit && id) {
      fetchProperty();
    }
  }, [id, isEdit]);

  const fetchProperty = async () => {
    if (!id) return;

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("properties")
        .select("*")
        .eq("id", id)
        .is("deleted_at", null)
        .single();

      if (error) {
        console.error("Error fetching property:", error);
        setError("Property not found");
      } else {
        setProperty(data);
      }
    } catch (err) {
      console.error("Error fetching property:", err);
      setError("Failed to load property");
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    navigate("/admin");
  };

  const handleSuccess = () => {
    navigate("/admin");
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (isEdit && (error || !property)) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Property Not Found
          </h2>
          <p className="text-gray-600 mb-4">
            {error || "The property you are trying to edit does not exist."}
          </p>
          <button
            onClick={() => navigate("/admin")}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            Back to Admin
          </button>
        </div>
      </div>
    );
  }

  return (
    <AdminPropertyForm
      property={property}
      onBack={handleBack}
      onSuccess={handleSuccess}
    />
  );
}
