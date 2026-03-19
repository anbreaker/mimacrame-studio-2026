import { inject, Injectable } from '@angular/core';
import {
  Auth,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  user,
  UserCredential,
} from '@angular/fire/auth';
import { doc, Firestore, getDoc } from '@angular/fire/firestore';
import { from, map, Observable, of, switchMap } from 'rxjs';

import { AppUser } from '@core/interfaces/user.interface';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly auth = inject(Auth);
  private readonly firestore = inject(Firestore);

  readonly currentUser$: Observable<AppUser | null> = user(this.auth).pipe(
    switchMap((firebaseUser) =>
      firebaseUser
        ? from(getDoc(doc(this.firestore, `users/${firebaseUser.uid}`))).pipe(
            map(
              (snapshot) =>
                ({
                  uid: firebaseUser.uid,
                  email: firebaseUser.email,
                  displayName: firebaseUser.displayName,
                  photoURL: firebaseUser.photoURL,
                  isAdmin: snapshot.exists() ? (snapshot.data()['isAdmin'] ?? false) : false,
                }) satisfies AppUser
            )
          )
        : of(null)
    )
  );

  login(email: string, password: string): Observable<UserCredential> {
    return from(signInWithEmailAndPassword(this.auth, email, password));
  }

  loginWithGoogle(): Observable<UserCredential> {
    return from(signInWithPopup(this.auth, new GoogleAuthProvider()));
  }

  logout(): Observable<void> {
    return from(signOut(this.auth));
  }
}
