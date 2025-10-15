import { useState, useEffect } from "react";
import {
  Home,
  Search,
  CheckCircle,
  Users,
  Shield,
  ArrowRight,
  Building2,
  MapPin,
  TrendingUp,
} from "lucide-react";
import { supabase } from "../lib/supabase";
import { PropertyCard } from "../components/PropertyCard";

interface LandingPageProps {
  onLogin: () => void;
  onSignup: () => void;
  onViewProperty: (property: any) => void;
}

export const LandingPage = ({
  onLogin,
  onSignup,
  onViewProperty,
}: LandingPageProps) => {
  const [featuredProperties, setFeaturedProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFeaturedProperties();
  }, []);

  const fetchFeaturedProperties = async () => {
    try {
      const { data, error } = await supabase
        .from("properties")
        .select("*")
        .is("deleted_at", null)
        .order("created_at", { ascending: false })
        .limit(6);

      if (error) {
        console.warn(
          "Could not fetch properties for landing page:",
          error.message
        );
        // If it's a 401/403 error, just continue without properties
        if (
          error.message.includes("401") ||
          error.message.includes("403") ||
          error.message.includes("JWT")
        ) {
          console.log(
            "🔒 Properties require authentication - showing landing page without featured properties"
          );
          setFeaturedProperties([]);
        } else {
          throw error;
        }
      } else {
        setFeaturedProperties(data || []);
      }
    } catch (error) {
      console.error("Error fetching properties:", error);
      // Gracefully handle errors by showing landing page without properties
      setFeaturedProperties([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <header className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-sm shadow-sm z-50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-blue-600 to-blue-700 p-2.5 rounded-xl shadow-lg">
                <Home className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Shree Krishna Properties
                </h1>
                <p className="text-xs text-gray-600">Your Dream Home Awaits</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={onLogin}
                className="px-6 py-2.5 text-gray-700 hover:text-gray-900 font-medium transition-colors"
              >
                Sign In
              </button>
              <button
                onClick={onSignup}
                className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium shadow-md hover:shadow-lg transition-all"
              >
                Get Started
              </button>
            </div>
          </div>
        </div>
      </header>

      <section className="pt-32 pb-20 px-4 bg-gradient-to-br from-blue-50 via-white to-blue-50">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-medium">
                <TrendingUp className="w-4 h-4" />
                <span>Trusted by 1000+ Families</span>
              </div>
              <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                Find Your Perfect
                <span className="block text-blue-600">Property Today</span>
              </h1>
              <p className="text-xl text-gray-600 leading-relaxed">
                Discover premium properties for rent and sale across prime
                locations. Your dream home is just a click away.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={onSignup}
                  className="flex items-center justify-center gap-2 bg-blue-600 text-white px-8 py-4 rounded-xl hover:bg-blue-700 font-semibold shadow-lg hover:shadow-xl transition-all text-lg"
                >
                  <span>Explore Properties</span>
                  <ArrowRight className="w-5 h-5" />
                </button>
                <button
                  onClick={onLogin}
                  className="flex items-center justify-center gap-2 bg-white text-gray-700 px-8 py-4 rounded-xl hover:bg-gray-50 font-semibold border-2 border-gray-200 transition-all text-lg"
                >
                  <Search className="w-5 h-5" />
                  <span>Search Now</span>
                </button>
              </div>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-blue-700 rounded-3xl transform rotate-3"></div>
              <div className="relative bg-white rounded-3xl shadow-2xl p-8 space-y-6">
                <div className="flex items-center gap-4 p-4 bg-green-50 rounded-xl">
                  <div className="bg-green-600 p-3 rounded-full">
                    <CheckCircle className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="font-bold text-gray-900">
                      Verified Properties
                    </p>
                    <p className="text-sm text-gray-600">
                      100% Authentic Listings
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-4 bg-blue-50 rounded-xl">
                  <div className="bg-blue-600 p-3 rounded-full">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="font-bold text-gray-900">Expert Support</p>
                    <p className="text-sm text-gray-600">
                      Dedicated Team Available
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-4 bg-orange-50 rounded-xl">
                  <div className="bg-orange-600 p-3 rounded-full">
                    <Shield className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="font-bold text-gray-900">
                      Secure Transactions
                    </p>
                    <p className="text-sm text-gray-600">
                      Protected & Transparent
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Why Choose Us?
            </h2>
            <p className="text-xl text-gray-600">
              Everything you need to find your perfect property
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gradient-to-br from-blue-50 to-white p-8 rounded-2xl border border-blue-100 hover:shadow-xl transition-shadow">
              <div className="bg-blue-600 w-14 h-14 rounded-xl flex items-center justify-center mb-6">
                <Building2 className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                Wide Selection
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Browse through hundreds of verified properties including plots,
                kothis, apartments, and commercial spaces.
              </p>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-white p-8 rounded-2xl border border-green-100 hover:shadow-xl transition-shadow">
              <div className="bg-green-600 w-14 h-14 rounded-xl flex items-center justify-center mb-6">
                <MapPin className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                Prime Locations
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Properties in the most sought-after areas with excellent
                connectivity and amenities.
              </p>
            </div>
            <div className="bg-gradient-to-br from-orange-50 to-white p-8 rounded-2xl border border-orange-100 hover:shadow-xl transition-shadow">
              <div className="bg-orange-600 w-14 h-14 rounded-xl flex items-center justify-center mb-6">
                <Shield className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                Trusted Service
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Years of experience ensuring smooth and transparent property
                transactions.
              </p>
            </div>
          </div>
        </div>
      </section>

      {!loading && featuredProperties.length > 0 && (
        <section className="py-20 px-4 bg-gray-50">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Featured Properties
              </h2>
              <p className="text-xl text-gray-600">
                Handpicked properties just for you
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredProperties.map((property) => (
                <PropertyCard
                  key={property.id}
                  property={property}
                  onClick={onViewProperty}
                />
              ))}
            </div>
            <div className="text-center mt-12">
              <button
                onClick={onSignup}
                className="inline-flex items-center gap-2 bg-blue-600 text-white px-8 py-4 rounded-xl hover:bg-blue-700 font-semibold shadow-lg hover:shadow-xl transition-all"
              >
                <span>View All Properties</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </section>
      )}

      <section className="py-20 px-4 bg-gradient-to-br from-blue-600 to-blue-700 text-white">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <h2 className="text-4xl lg:text-5xl font-bold">
            Ready to Find Your Dream Property?
          </h2>
          <p className="text-xl text-blue-100">
            Join thousands of satisfied customers who found their perfect home
            with us
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={onSignup}
              className="bg-white text-blue-600 px-8 py-4 rounded-xl hover:bg-blue-50 font-semibold shadow-lg hover:shadow-xl transition-all text-lg"
            >
              Create Free Account
            </button>
            <button
              onClick={onLogin}
              className="bg-blue-500 text-white px-8 py-4 rounded-xl hover:bg-blue-400 font-semibold border-2 border-white/20 transition-all text-lg"
            >
              Sign In Now
            </button>
          </div>
        </div>
      </section>

      <footer className="bg-gray-900 text-white py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-blue-600 p-2 rounded-lg">
                  <Home className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold">Shree Krishna Properties</h3>
              </div>
              <p className="text-gray-400">
                Your trusted partner in finding the perfect property. Quality
                service since years.
              </p>
            </div>
            <div>
              <h4 className="text-lg font-bold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <button
                    onClick={onLogin}
                    className="hover:text-white transition-colors"
                  >
                    Properties
                  </button>
                </li>
                <li>
                  <button
                    onClick={onSignup}
                    className="hover:text-white transition-colors"
                  >
                    Register
                  </button>
                </li>
                <li>
                  <button
                    onClick={onLogin}
                    className="hover:text-white transition-colors"
                  >
                    Sign In
                  </button>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-bold mb-4">Contact</h4>
              <ul className="space-y-2 text-gray-400">
                <li>Email: g.mehta1971@gmail.com</li>
                <li>Phone: 7877059117</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-gray-400">
            <p>&copy; 2025 Shree Krishna Properties. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};
