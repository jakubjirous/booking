import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import firebase from 'firebase/compat';
import { BehaviorSubject, from, Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { User } from '../../models/user.model';
import UserCredential = firebase.auth.UserCredential;

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private _user = new BehaviorSubject<User>(null);

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
    this._user.next(null);
  }

  private setUserData(userCredential: UserCredential): void {
    userCredential?.user?.getIdTokenResult().then((token) => {
      const expirationTime = new Date(token?.expirationTime);
      this._user.next(
        new User(
          token?.claims?.user_id,
          token?.claims?.email,
          token?.token,
          expirationTime
        )
      );
    });
  }
}
