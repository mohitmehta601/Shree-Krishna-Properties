import { MapPin, Home, Maximize } from 'lucide-react';
import { formatPrice } from '../lib/utils';

export const PropertyCard = ({ property, onClick }: any) => {
  return (
    <div onClick={() => onClick(property)} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow cursor-pointer group">
      <div className="relative h-48 overflow-hidden"><img src={property.thumbnail_url} alt={property.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" /><div className="absolute top-3 right-3 bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium">{property.ad_type}</div></div>
      <div className="p-5 space-y-3">
        <h3 className="text-xl font-bold text-gray-900 line-clamp-1">{property.name}</h3>
        <div className="flex items-start gap-2 text-gray-600"><MapPin className="w-5 h-5 flex-shrink-0 mt-0.5" /><p className="text-sm line-clamp-2">{property.full_location}</p></div>
        <div className="flex items-center gap-4 text-sm text-gray-600"><div className="flex items-center gap-1"><Home className="w-4 h-4" /><span>{property.property_type}</span></div><div className="flex items-center gap-1"><Maximize className="w-4 h-4" /><span>{property.area_sqft} sq ft</span></div></div>
        <div className="pt-3 border-t border-gray-200"><p className="text-2xl font-bold text-blue-600">{formatPrice(Number(property.price))}</p></div>
      </div>
    </div>
  );
};
