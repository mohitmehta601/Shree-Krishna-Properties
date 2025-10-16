import { useState, useEffect } from 'react';
import { ArrowLeft, CheckCircle, XCircle, Calendar, User, Mail, Phone, MapPin } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { formatDate } from '../lib/utils';
import type { Database } from '../lib/database.types';

type Inquiry = Database['public']['Tables']['inquiries']['Row'];
type Property = Database['public']['Tables']['properties']['Row'];
type Profile = Database['public']['Tables']['profiles']['Row'];

interface InquiryWithDetails extends Inquiry {
  property: Property;
  profile: Profile;
}

interface AdminInquiriesProps {
  onBack: () => void;
}

export const AdminInquiries = ({ onBack }: AdminInquiriesProps) => {
  const [inquiries, setInquiries] = useState<InquiryWithDetails[]>([]);
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'denied'>('all');
  const [loading, setLoading] = useState(true);
  const [actionInquiry, setActionInquiry] = useState<string | null>(null);
  const [assignedDate, setAssignedDate] = useState('');
  const [assignedTime, setAssignedTime] = useState('');
  const [adminNotes, setAdminNotes] = useState('');
  const [userDetails, setUserDetails] = useState<Profile | null>(null);

  useEffect(() => {
    fetchInquiries();
  }, [filter]);

  const fetchInquiries = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('inquiries')
        .select(`
          *,
          property:properties(*),
          profile:profiles!inquiries_user_id_fkey(*)
        `)
        .order('created_at', { ascending: false });

      if (filter !== 'all') {
        query = query.eq('status', filter);
      }

      const { data, error } = await query;

      if (error) throw error;
      setInquiries(data as any || []);
    } catch (error) {
      console.error('Error fetching inquiries:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (inquiryId: string) => {
    try {
      const approvedDateTime = assignedDate && assignedTime
        ? new Date(`${assignedDate}T${assignedTime}`).toISOString()
        : null;

      const { error } = await supabase
        .from('inquiries')
        .update({
          status: 'approved',
          admin_assigned_datetime: approvedDateTime,
          admin_notes: adminNotes || null
        })
        .eq('id', inquiryId);

      if (error) throw error;

      setActionInquiry(null);
      setAssignedDate('');
      setAssignedTime('');
      setAdminNotes('');
      fetchInquiries();
    } catch (error) {
      console.error('Error approving inquiry:', error);
      alert('Failed to approve inquiry');
    }
  };

  const handleDeny = async (inquiryId: string) => {
    try {
      const { error } = await supabase
        .from('inquiries')
        .update({
          status: 'denied',
          admin_notes: adminNotes || null
        })
        .eq('id', inquiryId);

      if (error) throw error;

      setActionInquiry(null);
      setAdminNotes('');
      fetchInquiries();
    } catch (error) {
      console.error('Error denying inquiry:', error);
      alert('Failed to deny inquiry');
    }
  };

  const minDate = new Date().toISOString().split('T')[0];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Dashboard</span>
        </button>

        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Manage Inquiries</h1>

          <div className="flex gap-2">
            {(['all', 'pending', 'approved', 'denied'] as const).map((status) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  filter === status
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : inquiries.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl">
            <p className="text-gray-500">No inquiries found</p>
          </div>
        ) : (
          <div className="space-y-4">
            {inquiries.map((inquiry) => (
              <div key={inquiry.id} className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 mb-1">
                      {inquiry.property.name}
                    </h3>
                    <p className="text-gray-600 text-sm">{inquiry.property.full_location}</p>
                    <p className="text-xs text-gray-500 mt-1">ID: {inquiry.property.unique_code}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    inquiry.status === 'approved' ? 'bg-green-100 text-green-800' :
                    inquiry.status === 'denied' ? 'bg-red-100 text-red-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {inquiry.status.toUpperCase()}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 p-4 bg-gray-50 rounded-lg">
                  <div className="space-y-2">
                    <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                      <User className="w-4 h-4" />
                      User Details
                    </h4>
                    <p className="text-sm text-gray-700"><strong>Name:</strong> {inquiry.profile.name}</p>
                    <p className="text-sm text-gray-700 flex items-center gap-2">
                      <Phone className="w-4 h-4" />
                      {inquiry.profile.mobile}
                    </p>
                    <p className="text-sm text-gray-700 flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      {inquiry.profile.email}
                    </p>
                    <p className="text-sm text-gray-700 flex items-start gap-2">
                      <MapPin className="w-4 h-4 mt-0.5" />
                      <span>{inquiry.profile.address}</span>
                    </p>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      Visit Details
                    </h4>
                    <p className="text-sm text-gray-700">
                      <strong>Requested:</strong> {formatDate(inquiry.requested_visit_datetime)}
                    </p>
                    {inquiry.admin_assigned_datetime && (
                      <p className="text-sm text-green-700">
                        <strong>Approved for:</strong> {formatDate(inquiry.admin_assigned_datetime)}
                      </p>
                    )}
                    {inquiry.admin_notes && (
                      <p className="text-sm text-gray-700">
                        <strong>Notes:</strong> {inquiry.admin_notes}
                      </p>
                    )}
                  </div>
                </div>

                {inquiry.status === 'pending' && (
                  <div className="border-t border-gray-200 pt-4">
                    {actionInquiry === inquiry.id ? (
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Assign Date (Optional)
                            </label>
                            <input
                              type="date"
                              value={assignedDate}
                              onChange={(e) => setAssignedDate(e.target.value)}
                              min={minDate}
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Assign Time (Optional)
                            </label>
                            <input
                              type="time"
                              value={assignedTime}
                              onChange={(e) => setAssignedTime(e.target.value)}
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Admin Notes (Optional)
                          </label>
                          <textarea
                            value={adminNotes}
                            onChange={(e) => setAdminNotes(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                            rows={2}
                            placeholder="Add any notes for the user..."
                          />
                        </div>

                        <div className="flex gap-2">
                          <button
                            onClick={() => handleApprove(inquiry.id)}
                            className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
                          >
                            <CheckCircle className="w-4 h-4" />
                            Approve
                          </button>
                          <button
                            onClick={() => handleDeny(inquiry.id)}
                            className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
                          >
                            <XCircle className="w-4 h-4" />
                            Deny
                          </button>
                          <button
                            onClick={() => {
                              setActionInquiry(null);
                              setAssignedDate('');
                              setAssignedTime('');
                              setAdminNotes('');
                            }}
                            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <button
                        onClick={() => setActionInquiry(inquiry.id)}
                        className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
                      >
                        Take Action
                      </button>
                    )}
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
