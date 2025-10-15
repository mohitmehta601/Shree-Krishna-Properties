import { useState, useEffect } from 'react';
import { ArrowLeft, Upload, X } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { generateUniqueCode } from '../lib/utils';
import type { Database } from '../lib/database.types';

type Property = Database['public']['Tables']['properties']['Row'];

const PROPERTY_TYPES = ['Plot', 'Kothi', '1BHK', '2BHK', '3BHK', 'Studio apartment', 'Duplex', 'Triplex', 'Serviced apartment', 'Builder floor', 'Shop', 'Penthouse', 'Villa', 'Farmhouse'];
const AD_TYPES = ['Rent', 'Sale'];
const DIRECTIONS = ['North', 'East', 'South', 'West'];
const MAX_IMAGES = 4;

interface AdminPropertyFormProps {
  property?: Property | null;
  onBack: () => void;
  onSuccess: () => void;
}

export const AdminPropertyForm = ({ property, onBack, onSuccess }: AdminPropertyFormProps) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    full_location: '',
    lat: '',
    lng: '',
    description: '',
    price: '',
    area_sqft: '',
    property_type: 'Plot',
    ad_type: 'Sale',
    direction_facing: 'North',
    length: '',
    breadth: ''
  });
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [thumbnailIndex, setThumbnailIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (property) {
      setFormData({
        name: property.name,
        full_location: property.full_location,
        lat: property.lat?.toString() || '',
        lng: property.lng?.toString() || '',
        description: property.description,
        price: property.price.toString(),
        area_sqft: property.area_sqft.toString(),
        property_type: property.property_type,
        ad_type: property.ad_type,
        direction_facing: property.direction_facing,
        length: property.length.toString(),
        breadth: property.breadth.toString()
      });
      const existingImages = [property.thumbnail_url, ...(property.images as string[] || [])];
      setImagePreviews(existingImages.filter((v, i, a) => a.indexOf(v) === i));
    }
  }, [property]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);

    if (imageFiles.length + files.length > MAX_IMAGES) {
      setError(`Maximum ${MAX_IMAGES} images allowed`);
      return;
    }

    files.forEach(file => {
      if (!file.type.startsWith('image/')) {
        setError('Only image files are allowed');
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setError('Image size must be less than 5MB');
        return;
      }
    });

    setImageFiles([...imageFiles, ...files]);
    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviews(prev => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    setImageFiles(imageFiles.filter((_, i) => i !== index));
    setImagePreviews(imagePreviews.filter((_, i) => i !== index));
    if (thumbnailIndex === index) {
      setThumbnailIndex(0);
    } else if (thumbnailIndex > index) {
      setThumbnailIndex(thumbnailIndex - 1);
    }
  };

  const uploadImages = async (): Promise<string[]> => {
    const uploadedUrls: string[] = [];

    for (const file of imageFiles) {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `${property?.id || generateUniqueCode()}/${fileName}`;

      const { error: uploadError, data } = await supabase.storage
        .from('property-images')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('property-images')
        .getPublicUrl(filePath);

      uploadedUrls.push(publicUrl);
    }

    return uploadedUrls;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!property && imagePreviews.length === 0) {
      setError('Please upload at least one image');
      return;
    }

    setLoading(true);

    try {
      let imageUrls = imagePreviews.filter(p => p.startsWith('http'));

      if (imageFiles.length > 0) {
        const newUrls = await uploadImages();
        imageUrls = [...imageUrls, ...newUrls];
      }

      const thumbnailUrl = imageUrls[thumbnailIndex];
      const otherImages = imageUrls.filter((_, i) => i !== thumbnailIndex);

      const propertyData = {
        name: formData.name,
        full_location: formData.full_location,
        lat: formData.lat ? parseFloat(formData.lat) : null,
        lng: formData.lng ? parseFloat(formData.lng) : null,
        description: formData.description,
        price: parseFloat(formData.price),
        area_sqft: parseFloat(formData.area_sqft),
        property_type: formData.property_type,
        ad_type: formData.ad_type,
        direction_facing: formData.direction_facing,
        length: parseFloat(formData.length),
        breadth: parseFloat(formData.breadth),
        thumbnail_url: thumbnailUrl,
        images: otherImages,
        created_by: user!.id
      };

      if (property) {
        const { error: updateError } = await supabase
          .from('properties')
          .update(propertyData)
          .eq('id', property.id);

        if (updateError) throw updateError;
      } else {
        const { error: insertError } = await supabase
          .from('properties')
          .insert({ ...propertyData, unique_code: generateUniqueCode() });

        if (insertError) throw insertError;
      }

      onSuccess();
    } catch (err: any) {
      setError(err.message || 'Failed to save property');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Dashboard</span>
        </button>

        <div className="bg-white rounded-xl shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">
            {property ? 'Edit Property' : 'Add New Property'}
          </h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Property Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Property Type *
                </label>
                <select
                  value={formData.property_type}
                  onChange={(e) => setFormData({ ...formData, property_type: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                >
                  {PROPERTY_TYPES.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Location *
              </label>
              <textarea
                value={formData.full_location}
                onChange={(e) => setFormData({ ...formData, full_location: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                rows={2}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description *
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                rows={4}
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price (₹) *
                </label>
                <input
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Area (sq ft) *
                </label>
                <input
                  type="number"
                  value={formData.area_sqft}
                  onChange={(e) => setFormData({ ...formData, area_sqft: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ad Type *
                </label>
                <select
                  value={formData.ad_type}
                  onChange={(e) => setFormData({ ...formData, ad_type: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                >
                  {AD_TYPES.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Direction Facing *
                </label>
                <select
                  value={formData.direction_facing}
                  onChange={(e) => setFormData({ ...formData, direction_facing: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                >
                  {DIRECTIONS.map(dir => (
                    <option key={dir} value={dir}>{dir}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Length (ft) *
                </label>
                <input
                  type="number"
                  value={formData.length}
                  onChange={(e) => setFormData({ ...formData, length: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Breadth (ft) *
                </label>
                <input
                  type="number"
                  value={formData.breadth}
                  onChange={(e) => setFormData({ ...formData, breadth: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Images (Max {MAX_IMAGES}) *
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageChange}
                  className="hidden"
                  id="image-upload"
                  disabled={imagePreviews.length >= MAX_IMAGES}
                />
                <label
                  htmlFor="image-upload"
                  className={`flex flex-col items-center cursor-pointer ${imagePreviews.length >= MAX_IMAGES ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <Upload className="w-12 h-12 text-gray-400 mb-2" />
                  <span className="text-sm text-gray-600">Click to upload images</span>
                  <span className="text-xs text-gray-500 mt-1">
                    {imagePreviews.length}/{MAX_IMAGES} images uploaded
                  </span>
                </label>
              </div>

              {imagePreviews.length > 0 && (
                <div className="mt-4 space-y-4">
                  <p className="text-sm font-medium text-gray-700">
                    Select thumbnail image:
                  </p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {imagePreviews.map((preview, index) => (
                      <div key={index} className="relative">
                        <img
                          src={preview}
                          alt={`Preview ${index + 1}`}
                          className="w-full h-32 object-cover rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute top-2 right-2 bg-red-600 text-white p-1 rounded-full hover:bg-red-700"
                        >
                          <X className="w-4 h-4" />
                        </button>
                        <label className="absolute bottom-2 left-2 flex items-center gap-2 bg-white px-2 py-1 rounded">
                          <input
                            type="radio"
                            name="thumbnail"
                            checked={thumbnailIndex === index}
                            onChange={() => setThumbnailIndex(index)}
                            className="w-4 h-4"
                          />
                          <span className="text-xs font-medium">Thumbnail</span>
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            <div className="flex gap-4">
              <button
                type="button"
                onClick={onBack}
                className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                {loading ? 'Saving...' : property ? 'Update Property' : 'Add Property'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
