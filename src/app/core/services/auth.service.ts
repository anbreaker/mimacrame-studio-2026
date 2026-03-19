import { inject, Injectable } from '@angular/core';
import {
  Auth,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  User,
  user,
  UserCredential,
} from '@angular/fire/auth';
import { doc, Firestore, getDoc, setDoc } from '@angular/fire/firestore';
import { from, map, Observable, of, switchMap, tap } from 'rxjs';

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
                  displayName: firebaseUser.displayName,
                  email: firebaseUser.email,
                  isAdmin: snapshot.exists() ? (snapshot.data()['isAdmin'] ?? false) : false,
                  photoURL: firebaseUser.photoURL,
                  uid: firebaseUser.uid,
                }) satisfies AppUser
            )
          )
        : of(null)
    )
  );

  login(email: string, password: string): Observable<UserCredential> {
    return from(signInWithEmailAndPassword(this.auth, email, password)).pipe(
      tap((credential) => this.syncUser(credential.user))
    );
  }

  loginWithGoogle(): Observable<UserCredential> {
    return from(signInWithPopup(this.auth, new GoogleAuthProvider())).pipe(
      tap((credential) => this.syncUser(credential.user))
    );
  }

  logout(): Observable<void> {
    return from(signOut(this.auth));
  }

  updateProfile(uid: string, data: Partial<AppUser>): Observable<void> {
    return from(setDoc(doc(this.firestore, `users/${uid}`), data, { merge: true }));
  }

  private syncUser(user: User): void {
    const userDoc = doc(this.firestore, `users/${user.uid}`);
    getDoc(userDoc).then((snapshot) => {
      if (!snapshot.exists()) {
        setDoc(userDoc, {
          displayName: user.displayName,
          email: user.email,
          isAdmin: false,
          photoURL: user.photoURL,
        });
      }
    });
  }
}
