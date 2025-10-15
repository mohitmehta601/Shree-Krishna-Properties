import { useState } from "react";
import { MapPin, Home, Maximize, Calendar } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { supabase } from "../lib/supabase";
import { formatPrice } from "../lib/utils";
import { BackButton } from "../components/BackButton";

export const PropertyDetail = ({ property, onBack }: any) => {
  const { user } = useAuth();
  const [showScheduleForm, setShowScheduleForm] = useState(false);
  const [visitDate, setVisitDate] = useState("");
  const [visitTime, setVisitTime] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const minDate = new Date().toISOString().split("T")[0];

  const handleScheduleVisit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await supabase
        .from("inquiries")
        .insert({
          property_id: property.id,
          user_id: user!.id,
          requested_visit_datetime: new Date(
            `${visitDate}T${visitTime}`
          ).toISOString(),
          status: "pending",
        });
      setSuccess(true);
      setShowScheduleForm(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <BackButton onClick={onBack} />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl p-6">
          <h1 className="text-3xl font-bold">{property.name}</h1>
          <p className="text-3xl font-bold text-blue-600 mt-2">
            {formatPrice(Number(property.price))}
          </p>
          <div className="mt-4 space-y-2">
            <div className="flex gap-2">
              <MapPin className="w-5 h-5" />
              <span>{property.full_location}</span>
            </div>
            <div className="flex gap-2">
              <Home className="w-5 h-5" />
              <span>{property.property_type}</span>
            </div>
            <div className="flex gap-2">
              <Maximize className="w-5 h-5" />
              <span>{property.area_sqft} sq ft</span>
            </div>
          </div>
          <p className="mt-4">{property.description}</p>
          {success && (
            <div className="bg-green-50 p-4 mt-4 rounded">Visit requested!</div>
          )}
          {!showScheduleForm ? (
            <button
              onClick={() => setShowScheduleForm(true)}
              className="w-full bg-blue-600 text-white px-6 py-4 rounded-lg mt-4"
            >
              <Calendar className="w-5 h-5 inline mr-2" />
              Schedule Visit
            </button>
          ) : (
            <form onSubmit={handleScheduleVisit} className="mt-4 space-y-4">
              <input
                type="date"
                value={visitDate}
                onChange={(e) => setVisitDate(e.target.value)}
                min={minDate}
                required
                className="w-full px-4 py-2 border rounded"
              />
              <input
                type="time"
                value={visitTime}
                onChange={(e) => setVisitTime(e.target.value)}
                required
                className="w-full px-4 py-2 border rounded"
              />
              <button
                type="submit"
                disabled={loading}
                className="bg-blue-600 text-white px-4 py-2 rounded"
              >
                Submit
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
