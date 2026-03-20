import { inject, Injectable, signal } from '@angular/core';
import {
  deleteObject,
  getDownloadURL,
  ref,
  Storage,
  uploadBytesResumable,
} from '@angular/fire/storage';

@Injectable({ providedIn: 'root' })
export class UploadService {
  private readonly storage = inject(Storage);

  private readonly _percentage = signal(0);
  private readonly _isUploading = signal(false);

  readonly percentage = this._percentage.asReadonly();
  readonly isUploading = this._isUploading.asReadonly();

  async uploadProductImage(file: File, productId: string): Promise<string> {
    const path = `products/${productId}/${Date.now()}_${file.name}`;
    return this.uploadFile(file, path);
  }

  async uploadProfileImage(file: File, userId: string): Promise<string> {
    const path = `users/${userId}/profile_${Date.now()}_${file.name}`;
    return this.uploadFile(file, path);
  }

  async deleteImage(url: string): Promise<void> {
    const storageRef = ref(this.storage, url);
    await deleteObject(storageRef);
  }

  private async uploadFile(file: File, path: string): Promise<string> {
    const storageRef = ref(this.storage, path);
    const uploadTask = uploadBytesResumable(storageRef, file);

    this._isUploading.set(true);
    this._percentage.set(0);

    return new Promise((resolve, reject) => {
      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          this._percentage.set(progress);
        },
        (error) => {
          this._isUploading.set(false);
          reject(error);
        },
        async () => {
          try {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            this._isUploading.set(false);
            this._percentage.set(100);
            resolve(downloadURL);
          } catch (error) {
            this._isUploading.set(false);
            reject(error);
          }
        }
      );
    });
  }
}
