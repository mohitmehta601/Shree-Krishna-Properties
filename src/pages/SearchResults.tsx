import { useState, useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { PropertyCard } from '../components/PropertyCard';

export const SearchResults = ({ query, onBack, onViewProperty }: any) => {
  const [properties, setProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const search = async () => {
      const { data } = await supabase.from('properties').select('*').is('deleted_at', null).ilike('full_location', '%' + query + '%');
      setProperties(data || []);
      setLoading(false);
    };
    search();
  }, [query]);

  return <div className="min-h-screen bg-gray-50"><div className="max-w-7xl mx-auto px-4 py-8"><button onClick={onBack} className="flex items-center gap-2 mb-6"><ArrowLeft className="w-5 h-5" />Back</button><h1 className="text-2xl font-bold mb-4">Results for "{query}"</h1>{loading ? <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div></div> : <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">{properties.map(p => <PropertyCard key={p.id} property={p} onClick={onViewProperty} />)}</div>}</div></div>;
};
