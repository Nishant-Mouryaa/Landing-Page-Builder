export default class ImageService {
  private static cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  private static uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

  static async upload(image: File | Blob, preset?: string): Promise<string> {
    if (!this.cloudName) {
      throw new Error('Cloudinary cloud name not configured');
    }

    const uploadPreset = preset || this.uploadPreset;
    if (!uploadPreset) {
      throw new Error('Cloudinary upload preset not configured');
    }

    const formData = new FormData();
    formData.append('file', image);
    formData.append('upload_preset', uploadPreset);

    try {
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${this.cloudName}/image/upload`,
        {
          method: 'POST',
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error(`Upload failed: ${response.statusText}`);
      }

      const data = await response.json();
      return data.secure_url;
    } catch (error) {
      console.error('Image upload error:', error);
      throw new Error('Failed to upload image');
    }
  }

  static async uploadWithTransformation(
    image: File | Blob, 
    preset?: string, 
    transformations?: {
      width?: number;
      height?: number;
      crop?: string;
      quality?: number;
      format?: string;
    }
  ): Promise<string> {
    const baseUrl = await this.upload(image, preset);
    
    if (!transformations) {
      return baseUrl;
    }

    // Apply transformations to the URL
    const url = new URL(baseUrl);
    const pathParts = url.pathname.split('/');
    const versionIndex = pathParts.findIndex(part => part === 'v1');
    
    if (versionIndex !== -1) {
      const transformationString = this.buildTransformationString(transformations);
      pathParts.splice(versionIndex + 1, 0, transformationString);
      url.pathname = pathParts.join('/');
    }

    return url.toString();
  }

  private static buildTransformationString(transformations: any): string {
    const parts: string[] = [];
    
    if (transformations.width) parts.push(`w_${transformations.width}`);
    if (transformations.height) parts.push(`h_${transformations.height}`);
    if (transformations.crop) parts.push(`c_${transformations.crop}`);
    if (transformations.quality) parts.push(`q_${transformations.quality}`);
    if (transformations.format) parts.push(`f_${transformations.format}`);
    
    return parts.join(',');
  }

  static validateImage(file: File): { isValid: boolean; error?: string } {
    const maxSize = 5 * 1024 * 1024; // 5MB
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];

    if (file.size > maxSize) {
      return { isValid: false, error: 'Image size must be less than 5MB' };
    }

    if (!allowedTypes.includes(file.type)) {
      return { isValid: false, error: 'Only JPEG, PNG, GIF, and WebP images are allowed' };
    }

    return { isValid: true };
  }

  static async resizeImage(file: File, maxWidth: number, maxHeight: number): Promise<Blob> {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();

      img.onload = () => {
        const { width, height } = this.calculateDimensions(img.width, img.height, maxWidth, maxHeight);
        
        canvas.width = width;
        canvas.height = height;
        
        ctx?.drawImage(img, 0, 0, width, height);
        
        canvas.toBlob((blob) => {
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error('Failed to resize image'));
          }
        }, file.type, 0.8);
      };

      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = URL.createObjectURL(file);
    });
  }

  private static calculateDimensions(
    originalWidth: number, 
    originalHeight: number, 
    maxWidth: number, 
    maxHeight: number
  ): { width: number; height: number } {
    let { width, height } = { width: originalWidth, height: originalHeight };

    if (width > maxWidth) {
      height = (height * maxWidth) / width;
      width = maxWidth;
    }

    if (height > maxHeight) {
      width = (width * maxHeight) / height;
      height = maxHeight;
    }

    return { width: Math.round(width), height: Math.round(height) };
  }
} 