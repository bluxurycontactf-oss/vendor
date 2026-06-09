const IMGBB_KEY = process.env.NEXT_PUBLIC_IMGBB_KEY || '';

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
