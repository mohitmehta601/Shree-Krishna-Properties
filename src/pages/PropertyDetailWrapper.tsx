import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import { PropertyDetail } from "./PropertyDetail";
import { LoadingSpinner } from "../components/LoadingSpinner";
import type { Property } from "../App";

export function PropertyDetailWrapper() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      navigate("/", { replace: true });
      return;
    }

    fetchProperty();
  }, [id, navigate]);

  const fetchProperty = async () => {
    if (!id) return;

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
    // Go back to previous page or dashboard
    navigate(-1);
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error || !property) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Property Not Found
          </h2>
          <p className="text-gray-600 mb-4">
            {error || "The property you are looking for does not exist."}
          </p>
          <button
            onClick={() => navigate("/")}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  return <PropertyDetail property={property} onBack={handleBack} />;
}
