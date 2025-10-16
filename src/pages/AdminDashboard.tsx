import { useState, useEffect } from 'react';
import { Plus, LogOut, FileText, Home, Edit, Trash2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { formatPrice } from '../lib/utils';

export const AdminDashboard = ({ onAddProperty, onEditProperty, onViewInquiries }: any) => {
  const { signOut } = useAuth();
  const [properties, setProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  useEffect(() => { fetchProperties(); }, []);

  const fetchProperties = async () => {
    try {
      const { data } = await supabase.from('properties').select('*').is('deleted_at', null).order('created_at', { ascending: false });
      setProperties(data || []);
    } catch (error) {
      console.error('Error fetching properties:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await supabase.from('properties').update({ deleted_at: new Date().toISOString() }).eq('id', id);
      setProperties(properties.filter(p => p.id !== id));
      setDeleteConfirm(null);
    } catch (error) {
      alert('Failed to delete property');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm"><div className="max-w-7xl mx-auto px-4 py-4"><div className="flex items-center justify-between"><div className="flex items-center gap-3"><div className="bg-blue-600 p-2 rounded-lg"><Home className="w-6 h-6 text-white" /></div><div><h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1><p className="text-sm text-gray-600">Shree Krishna Properties</p></div></div><div className="flex items-center gap-3"><button onClick={onViewInquiries} className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"><FileText className="w-5 h-5" /><span>View Inquiries</span></button><button onClick={signOut} className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"><LogOut className="w-5 h-5" /><span>Sign Out</span></button></div></div></div></header>
      <main className="max-w-7xl mx-auto px-4 py-8"><div className="flex items-center justify-between mb-6"><h2 className="text-2xl font-bold text-gray-900">Property Management</h2><button onClick={onAddProperty} className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 font-medium"><Plus className="w-5 h-5" />Add New Property</button></div>{loading ? <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div></div> : properties.length === 0 ? <div className="text-center py-12 bg-white rounded-xl"><p className="text-gray-500 mb-4">No properties listed yet</p></div> : <div className="bg-white rounded-xl shadow-sm overflow-hidden"><table className="w-full"><thead className="bg-gray-50 border-b"><tr><th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Property</th><th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th><th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price</th><th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th></tr></thead><tbody className="divide-y">{properties.map((property) => <tr key={property.id} className="hover:bg-gray-50"><td className="px-6 py-4"><div className="flex items-center"><img src={property.thumbnail_url} className="w-12 h-12 rounded-lg object-cover" /><div className="ml-4"><div className="text-sm font-medium text-gray-900">{property.name}</div></div></div></td><td className="px-6 py-4"><span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">{property.property_type}</span></td><td className="px-6 py-4 text-sm text-gray-900">{formatPrice(Number(property.price))}</td><td className="px-6 py-4 text-right"><div className="flex items-center justify-end gap-2"><button onClick={() => onEditProperty(property)} className="text-blue-600 hover:text-blue-900 p-2 hover:bg-blue-50 rounded-lg"><Edit className="w-4 h-4" /></button>{deleteConfirm === property.id ? <><button onClick={() => handleDelete(property.id)} className="text-red-600 text-xs px-2 py-1 border border-red-600 rounded">Confirm</button><button onClick={() => setDeleteConfirm(null)} className="text-gray-600 text-xs px-2 py-1 border border-gray-300 rounded">Cancel</button></> : <button onClick={() => setDeleteConfirm(property.id)} className="text-red-600 hover:text-red-900 p-2 hover:bg-red-50 rounded-lg"><Trash2 className="w-4 h-4" /></button>}</div></td></tr>)}</tbody></table></div>}</main>
    </div>
  );
};
