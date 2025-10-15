import { useState, useEffect } from "react";
import { Calendar } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { supabase } from "../lib/supabase";
import { formatDate } from "../lib/utils";
import { BackButton } from "../components/BackButton";

export const UserInquiries = ({ onBack }: any) => {
  const { user } = useAuth();
  const [inquiries, setInquiries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      const { data } = await supabase
        .from("inquiries")
        .select("*, property:properties(*)")
        .eq("user_id", user!.id)
        .order("created_at", { ascending: false });
      setInquiries(data || []);
      setLoading(false);
    };
    fetch();
  }, [user]);

  const getColor = (status: string) =>
    status === "approved"
      ? "bg-green-100 text-green-800"
      : status === "denied"
      ? "bg-red-100 text-red-800"
      : "bg-yellow-100 text-yellow-800";

  return (
    <div className="min-h-screen bg-gray-50">
      <BackButton onClick={onBack} />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">My Visit Requests</h1>
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : inquiries.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl">
            No inquiries yet
          </div>
        ) : (
          <div className="space-y-4">
            {inquiries.map((i) => (
              <div key={i.id} className="bg-white rounded-xl p-6">
                <h3 className="font-bold">{i.property.name}</h3>
                <div className="mt-2 flex items-center gap-2 text-sm">
                  <Calendar className="w-4 h-4" />
                  <span>
                    Requested: {formatDate(i.requested_visit_datetime)}
                  </span>
                </div>
                <div
                  className={
                    "mt-2 inline-block px-3 py-1 rounded-full text-sm " +
                    getColor(i.status)
                  }
                >
                  {i.status.toUpperCase()}
                </div>
                {i.admin_assigned_datetime && (
                  <div className="mt-2 text-sm text-green-600">
                    Approved for: {formatDate(i.admin_assigned_datetime)}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
