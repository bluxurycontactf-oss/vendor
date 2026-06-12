const IMGBB_KEY = process.env.NEXT_PUBLIC_IMGBB_KEY || '';
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
const MAX_SIZE_MB = 10;

function compressImage(file: File, maxWidth = 1280, quality = 0.72): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const scale = Math.min(1, maxWidth / img.width);
        const w = Math.round(img.width * scale);
        const h = Math.round(img.height * scale);
        const canvas = document.createElement('canvas');
        canvas.width = w;
        canvas.height = h;
        canvas.getContext('2d')!.drawImage(img, 0, 0, w, h);
        resolve(canvas.toDataURL('image/jpeg', quality));
      };
      img.onerror = () => reject(new Error('Impossible de charger l\'image'));
      img.src = e.target!.result as string;
    };
    reader.onerror = () => reject(new Error('Impossible de lire le fichier'));
    reader.readAsDataURL(file);
  });
}

export async function uploadImage(file: File): Promise<string> {
  if (!ALLOWED_TYPES.includes(file.type)) throw new Error('Format non supporté (JPG, PNG, WebP, GIF)');
  if (file.size > MAX_SIZE_MB * 1024 * 1024) throw new Error(`Fichier trop lourd (max ${MAX_SIZE_MB} Mo)`);
  const dataUrl = await compressImage(file);
  const base64 = dataUrl.split(',')[1];
  const form = new FormData();
  form.append('key', IMGBB_KEY);
  form.append('image', base64);
  const res = await fetch('https://api.imgbb.com/1/upload', { method: 'POST', body: form });
  const json = await res.json();
  if (json?.success && json?.data?.url) return json.data.url;
  throw new Error('Échec de l\'upload');
}
