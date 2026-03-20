import { inject, Injectable } from '@angular/core';
import {
  Auth,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  User,
  user,
  UserCredential,
} from '@angular/fire/auth';
import { doc, Firestore, getDoc, setDoc, updateDoc } from '@angular/fire/firestore';
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
            map((snapshot) => {
              const data = snapshot.data();
              return {
                address: data?.['address'],
                createdAt: data?.['createdAt'],
                displayName: firebaseUser.displayName || data?.['displayName'],
                email: firebaseUser.email,
                isAdmin: data?.['isAdmin'] ?? false,
                photoURL: firebaseUser.photoURL || data?.['photoURL'],
                uid: firebaseUser.uid,
                updatedAt: data?.['updatedAt'],
              } satisfies AppUser;
            })
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

  register(email: string, password: string, displayName: string): Observable<UserCredential> {
    return from(createUserWithEmailAndPassword(this.auth, email, password)).pipe(
      tap((credential) => {
        const userDoc = doc(this.firestore, `users/${credential.user.uid}`);
        return setDoc(userDoc, {
          createdAt: new Date().toISOString(),
          displayName,
          email,
          isAdmin: false,
          photoURL: null,
          uid: credential.user.uid,
          updatedAt: new Date().toISOString(),
        });
      })
    );
  }

  private syncUser(user: User): void {
    const userDoc = doc(this.firestore, `users/${user.uid}`);
    getDoc(userDoc).then((snapshot) => {
      if (!snapshot.exists()) {
        setDoc(userDoc, {
          createdAt: new Date().toISOString(),
          displayName: user.displayName,
          email: user.email,
          isAdmin: false,
          photoURL: user.photoURL,
          uid: user.uid,
          updatedAt: new Date().toISOString(),
        });
      }
    });
  }

  updateProfile(uid: string, data: Partial<AppUser>): Observable<void> {
    return from(
      updateDoc(doc(this.firestore, `users/${uid}`), {
        ...data,
        updatedAt: new Date().toISOString(),
      })
    );
  }
}
