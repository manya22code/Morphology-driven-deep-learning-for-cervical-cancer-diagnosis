export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      if (!event.target?.result) {
        return reject(new Error("Failed to read file."));
      }
      const img = new Image();
      img.src = event.target.result as string;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          return reject(new Error('Could not get canvas context'));
        }
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);
        // Standardize to PNG format which is supported by the Gemini API
        resolve(canvas.toDataURL('image/png'));
      };
      img.onerror = (error) => reject(new Error(`Image load error: ${error}`));
    };
    reader.onerror = (error) => reject(new Error(`File reader error: ${error}`));
  });
};

export const generateAugmentedImage = (base64Image: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = base64Image;
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        return reject(new Error('Could not get canvas context'));
      }

      canvas.width = img.width;
      canvas.height = img.height;
      
      // Apply "augmentations"
      ctx.translate(canvas.width / 2, canvas.height / 2);
      ctx.rotate((Math.random() - 0.5) * 0.2); // Random rotation between ~ -5.7 and +5.7 degrees
      ctx.scale(1.02, 1.02); // Slight zoom
      ctx.translate(-canvas.width / 2, -canvas.height / 2);
      
      // Slightly adjust saturation for visual effect
      ctx.filter = 'saturate(1.1)'; 
      
      ctx.drawImage(img, 0, 0);

      resolve(canvas.toDataURL('image/png'));
    };
    img.onerror = (error) => reject(error);
  });
};