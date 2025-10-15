import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Search, LogOut, FileText, Home } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { supabase } from "../lib/supabase";
import { ImageViewer } from "../components/ImageViewer";
import { PropertyCard } from "../components/PropertyCard";
import { BackButton } from "../components/BackButton";
import type { Property } from "../App";

export const UserDashboard = () => {
  const { profile, signOut } = useAuth();
  const navigate = useNavigate();
  const [properties, setProperties] = useState<Property[]>([]);
  const [featuredImages, setFeaturedImages] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    try {
      const { data } = await supabase
        .from("properties")
        .select("*")
        .is("deleted_at", null)
        .order("created_at", { ascending: false });
      setProperties(data || []);
      const images =
        (data || [])
          .slice(0, 5)
          .map((p: Property) => p.thumbnail_url)
          .filter(Boolean) || [];
      setFeaturedImages(images);
    } catch (error) {
      console.error("Error fetching properties:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <BackButton onClick={() => navigate("/")} />
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="bg-blue-600 p-2 rounded-lg">
                <Home className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Shree Krishna Properties
                </h1>
                <p className="text-sm text-gray-600">
                  Welcome, {profile?.name}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate("/inquiries")}
                className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
              >
                <FileText className="w-5 h-5" />
                <span>My Inquiries</span>
              </button>
              <button
                onClick={signOut}
                className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
              >
                <LogOut className="w-5 h-5" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
          <form onSubmit={handleSearch} className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search properties by address or location..."
              className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <button
              type="submit"
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
            >
              Search
            </button>
          </form>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-4 py-8 space-y-8">
        {featuredImages.length > 0 && (
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Featured Properties
            </h2>
            <ImageViewer images={featuredImages} />
          </section>
        )}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            All Properties
          </h2>
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : properties.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-xl">
              <p className="text-gray-500">No properties available</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {properties.map((property) => (
                <PropertyCard
                  key={property.id}
                  property={property}
                  onClick={(property: any) =>
                    navigate(`/property/${property.id}`)
                  }
                />
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
};
