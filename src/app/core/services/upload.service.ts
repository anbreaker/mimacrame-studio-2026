import { inject, Injectable } from '@angular/core';
import {
  deleteObject,
  getDownloadURL,
  ref,
  Storage,
  uploadBytesResumable,
} from '@angular/fire/storage';
import { from, Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class UploadService {
  private readonly storage = inject(Storage);

  uploadProductImage(file: File, productId: string): Observable<string> {
    const path = `products/${productId}/${Date.now()}_${file.name}`;
    const storageRef = ref(this.storage, path);
    const task = uploadBytesResumable(storageRef, file);

    return new Observable<string>((observer) => {
      task.on(
        'state_changed',
        null,
        (error) => observer.error(error),
        () => {
          getDownloadURL(task.snapshot.ref).then((url) => {
            observer.next(url);
            observer.complete();
          });
        }
      );
    });
  }

  deleteImage(url: string): Observable<void> {
    return from(deleteObject(ref(this.storage, url)));
  }
}
