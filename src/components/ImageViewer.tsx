import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Play, Pause } from 'lucide-react';

export const ImageViewer = ({ images, autoplayInterval = 3000 }: any) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  useEffect(() => {
    if (!isPlaying || images.length <= 1) return;
    const interval = setInterval(() => setCurrentIndex((prev) => (prev + 1) % images.length), autoplayInterval);
    return () => clearInterval(interval);
  }, [isPlaying, images.length, autoplayInterval]);

  if (images.length === 0) return <div className="w-full h-96 bg-gray-200 rounded-xl flex items-center justify-center"><p className="text-gray-500">No images available</p></div>;

  return (
    <div className="space-y-4">
      <div className="relative w-full h-96 bg-gray-900 rounded-xl overflow-hidden group">
        <img src={images[currentIndex]} alt={`Slide ${currentIndex + 1}`} className="w-full h-full object-cover" />
        <button onClick={() => setCurrentIndex((prev) => (prev - 1 + images.length) % images.length)} className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-900 p-3 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"><ChevronLeft className="w-6 h-6" /></button>
        <button onClick={() => setCurrentIndex((prev) => (prev + 1) % images.length)} className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-900 p-3 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"><ChevronRight className="w-6 h-6" /></button>
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
          <button onClick={() => setIsPlaying(!isPlaying)} className="bg-white/90 hover:bg-white text-gray-900 px-4 py-2 rounded-full flex items-center gap-2">{isPlaying ? <><Pause className="w-4 h-4" /><span className="text-sm font-medium">Pause</span></> : <><Play className="w-4 h-4" /><span className="text-sm font-medium">Play</span></>}</button>
        </div>
      </div>
      <div className="flex gap-2 overflow-x-auto pb-2">
        {images.map((image: string, index: number) => (
          <button key={index} onClick={() => setCurrentIndex(index)} className={`flex-shrink-0 w-24 h-20 rounded-lg overflow-hidden border-2 transition-all ${index === currentIndex ? 'border-blue-600 ring-2 ring-blue-600 ring-offset-2' : 'border-gray-300 hover:border-blue-400'}`}><img src={image} alt={`Thumbnail ${index + 1}`} className="w-full h-full object-cover" /></button>
        ))}
      </div>
    </div>
  );
};
