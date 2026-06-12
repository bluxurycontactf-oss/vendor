'use client';
import { useRef, useState } from 'react';
import { uploadImage } from '@/lib/imgbb';
import { ImagePlus, X, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

interface Props {
  images: string[];
  onChange: (images: string[]) => void;
  max?: number;
  label?: string;
}

export default function ImageUploader({ images, onChange, max = 5, label = 'Photos du produit' }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const handleFiles = async (files: FileList | null) => {
    if (!files) return;
    const remaining = max - images.length;
    const toUpload = Array.from(files).slice(0, remaining);
    if (toUpload.length === 0) { toast.error(`Maximum ${max} photos`); return; }

    setUploading(true);
    try {
      const urls = await Promise.all(toUpload.map(f => uploadImage(f)));
      onChange([...images, ...urls]);
      toast.success(`${urls.length} photo(s) ajoutée(s)`);
    } catch {
      toast.error('Erreur lors de l\'upload');
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = '';
    }
  };

  const remove = (idx: number) => {
    onChange(images.filter((_, i) => i !== idx));
  };

  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
        {label} <span className="text-gray-400 font-normal">({images.length}/{max})</span>
      </label>

      <div className="flex flex-wrap gap-2">
        {/* Previews */}
        {images.map((url, i) => (
          <div key={i} className="relative w-20 h-20 rounded-xl overflow-hidden border-2 border-gray-200 dark:border-gray-700 flex-shrink-0">
            <img src={url} alt="" className="w-full h-full object-cover" />
            <button
              type="button"
              onClick={() => remove(i)}
              className="absolute top-0.5 right-0.5 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center shadow"
            >
              <X size={11} className="text-white" />
            </button>
          </div>
        ))}

        {/* Add button */}
        {images.length < max && (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
            className="w-20 h-20 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-600 flex flex-col items-center justify-center gap-1 text-gray-400 hover:border-[#0A66FF] hover:text-[#0A66FF] transition-colors disabled:opacity-50 flex-shrink-0"
          >
            {uploading
              ? <Loader2 size={20} className="animate-spin" />
              : <><ImagePlus size={20} /><span className="text-xs font-medium">Ajouter</span></>
            }
          </button>
        )}
      </div>

      <p className="text-xs text-gray-400">JPG, PNG, WebP — compressées automatiquement (max 1280px)</p>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={e => handleFiles(e.target.files)}
      />
    </div>
  );
}
