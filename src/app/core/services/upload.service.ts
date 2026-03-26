import { Injectable, signal } from '@angular/core';

import { environment } from '@environments/environment';

const CLOUDINARY_UPLOAD_URL = `https://api.cloudinary.com/v1_1/${environment.cloudinary.cloudName}/image/upload`;

@Injectable({ providedIn: 'root' })
export class UploadService {
  private readonly _isUploading = signal(false);
  private readonly _percentage = signal(0);

  readonly isUploading = this._isUploading.asReadonly();
  readonly percentage = this._percentage.asReadonly();

  // Cloudinary deletion requires a signed request from the backend — not supported client-side
  deleteImage(_url: string): Promise<void> {
    return Promise.resolve();
  }

  private uploadFile(file: File, folder: string): Promise<string> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', environment.cloudinary.uploadPreset);
    formData.append('folder', folder);

    this._isUploading.set(true);
    this._percentage.set(0);

    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();

      xhr.upload.addEventListener('progress', (event) => {
        if (event.lengthComputable) {
          this._percentage.set((event.loaded / event.total) * 100);
        }
      });

      xhr.addEventListener('load', () => {
        this._isUploading.set(false);
        if (xhr.status === 200) {
          const response = JSON.parse(xhr.responseText) as { secure_url: string };
          resolve(response.secure_url);
        } else {
          reject(new Error(`Upload failed: ${xhr.statusText}`));
        }
      });

      xhr.addEventListener('error', () => {
        this._isUploading.set(false);
        reject(new Error('Upload failed: network error'));
      });

      xhr.open('POST', CLOUDINARY_UPLOAD_URL);
      xhr.send(formData);
    });
  }

  uploadProductImage(file: File, productId: string, category: string): Promise<string> {
    return this.uploadFile(file, `mimacrame/products/${category}/${productId}`);
  }

  uploadProfileImage(file: File, userId: string): Promise<string> {
    return this.uploadFile(file, `mimacrame/users/${userId}`);
  }
}
