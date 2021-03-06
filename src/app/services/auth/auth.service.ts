import { Injectable, OnDestroy } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Storage } from '@capacitor/storage';
import firebase from 'firebase/compat';
import { BehaviorSubject, from, Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { IAuthData, StorageKey, User } from '../../models/user.model';
import UserCredential = firebase.auth.UserCredential;

@Injectable({
  providedIn: 'root',
})
export class AuthService implements OnDestroy {
  private _user = new BehaviorSubject<User>(null);
  private activeLogoutTimer: any;

  constructor(private ngFireAuth: AngularFireAuth) {}

  get userIsAuthenticated(): Observable<boolean> {
    return this._user
      .asObservable()
      .pipe(map((user) => (user ? !!user.token : false)));
  }

  get userId(): Observable<string> {
    return this._user
      .asObservable()
      .pipe(map((user) => (user ? user.id : null)));
  }

  get token(): Observable<string> {
    return this._user
      .asObservable()
      .pipe(map((user) => (user ? user.token : null)));
  }

  autoLogin(): Observable<boolean> {
    return from(Storage.get({ key: StorageKey.AUTH_DATA })).pipe(
      map((storedData) => {
        if (!storedData || !storedData?.value) {
          return null;
        }

        const parsedData = JSON.parse(storedData?.value) as IAuthData;
        const expirationTime = new Date(parsedData?.tokenExpirationTime);

        if (expirationTime <= new Date()) {
          return null;
        }

        return new User(
          parsedData?.userId,
          parsedData?.email,
          parsedData?.token,
          expirationTime
        );
      }),
      tap((user) => {
        if (user) {
          this._user.next(user);
          this.autoLogout(user.tokenDuration);
        }
      }),
      map((user) => {
        return !!user;
      })
    );
  }

  registerUser(email: string, password: string): Observable<UserCredential> {
    return from(
      this.ngFireAuth.createUserWithEmailAndPassword(email, password)
    ).pipe(tap(this.setUserData.bind(this)));
  }

  loginUser(email: string, password: string): Observable<UserCredential> {
    return from(
      this.ngFireAuth.signInWithEmailAndPassword(email, password)
    ).pipe(tap(this.setUserData.bind(this)));
  }

  logout(): void {
    if (this.activeLogoutTimer) {
      clearTimeout(this.activeLogoutTimer);
    }
    Storage.remove({ key: StorageKey.AUTH_DATA });
    this._user.next(null);
  }

  ngOnDestroy(): void {
    // preventing memory leaks
    if (this.activeLogoutTimer) {
      clearTimeout(this.activeLogoutTimer);
    }
  }

  private autoLogout(duration: number): void {
    if (this.activeLogoutTimer) {
      clearTimeout(this.activeLogoutTimer);
    }
    this.activeLogoutTimer = setTimeout(() => {
      this.logout();
    }, duration);
  }

  private setUserData(userCredential: UserCredential): void {
    userCredential?.user?.getIdTokenResult().then((token) => {
      const expirationTime = new Date(token?.expirationTime);
      const user = new User(
        token?.claims?.user_id,
        token?.claims?.email,
        token?.token,
        expirationTime
      );
      this._user.next(user);
      this.autoLogout(user.tokenDuration);
      this.storeAuthData(
        token?.claims?.user_id,
        token?.claims?.email,
        token?.token,
        expirationTime.toISOString()
      );
    });
  }

  private storeAuthData(
    userId: string,
    email: string,
    token: string,
    tokenExpirationTime: string
  ): void {
    const authData = JSON.stringify({
      userId: userId,
      email: email,
      token: token,
      tokenExpirationTime: tokenExpirationTime,
    });
    Storage.set({
      key: StorageKey.AUTH_DATA,
      value: authData,
    });
  }
}
