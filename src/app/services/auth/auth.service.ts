import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor() {}

  // TODO: DEV (Jakub Jirous 2021-10-19 12:17:44)
  private _userIsAuthenticated = true;

  get userIsAuthenticated(): boolean {
    return this._userIsAuthenticated;
  }

  login() {
    this._userIsAuthenticated = true;
  }

  logout() {
    this._userIsAuthenticated = false;
  }
}
