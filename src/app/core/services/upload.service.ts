import { Injectable, signal } from '@angular/core';

import { environment } from '@environments/environment';

const CLOUDINARY_BASE_URL = `https://api.cloudinary.com/v1_1/${environment.cloudinary.cloudName}`;

@Injectable({ providedIn: 'root' })
export class UploadService {
  private readonly _isUploading = signal(false);
  private readonly _percentage = signal(0);

  readonly isUploading = this._isUploading.asReadonly();
  readonly percentage = this._percentage.asReadonly();

  deleteImage(_url: string): Promise<void> {
    return Promise.resolve();
  }

  private uploadFile(
    file: File,
    folder: string,
    resourceType: 'image' | 'video' = 'image'
  ): Promise<string> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', environment.cloudinary.uploadPreset);
    formData.append('folder', folder);
    if (resourceType === 'video') {
      formData.append('resource_type', 'video');
    }

    this._isUploading.set(true);
    this._percentage.set(0);

    return new Promise((resolve, reject) => {
      const xmlHttpRequest = new XMLHttpRequest();

      xmlHttpRequest.upload.addEventListener('progress', (event) => {
        if (event.lengthComputable) {
          this._percentage.set((event.loaded / event.total) * 100);
        }
      });

      xmlHttpRequest.addEventListener('load', () => {
        this._isUploading.set(false);
        if (xmlHttpRequest.status === 200) {
          const response = JSON.parse(xmlHttpRequest.responseText) as { secure_url: string };
          resolve(response.secure_url);
        } else {
          reject(new Error(`Upload failed: ${xmlHttpRequest.statusText}`));
        }
      });

      xmlHttpRequest.addEventListener('error', () => {
        this._isUploading.set(false);
        reject(new Error('Upload failed: network error'));
      });

      xmlHttpRequest.open('POST', `${CLOUDINARY_BASE_URL}/${resourceType}/upload`);
      xmlHttpRequest.send(formData);
    });
  }

  uploadPostImage(file: File, postId: string): Promise<string> {
    return this.uploadFile(file, `mimacrame/posts/${postId}`);
  }

  uploadPostVideo(file: File, postId: string): Promise<string> {
    return this.uploadFile(file, `mimacrame/posts/${postId}/video`, 'video');
  }

  uploadProductImage(file: File, productId: string, category: string): Promise<string> {
    return this.uploadFile(file, `mimacrame/products/${category}/${productId}`);
  }

  uploadProductVideo(file: File, productId: string, category: string): Promise<string> {
    return this.uploadFile(file, `mimacrame/products/${category}/${productId}/video`, 'video');
  }

  uploadProfileImage(file: File, userId: string): Promise<string> {
    return this.uploadFile(file, `mimacrame/users/${userId}`);
  }
}
