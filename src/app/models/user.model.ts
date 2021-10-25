export class User {
  constructor(
    public id: string,
    public email: string,
    private _token: string,
    public tokenExpirationData: Date
  ) {}

  get token(): string {
    if (!this.tokenExpirationData || this.tokenExpirationData <= new Date()) {
      return null;
    }
    return this._token;
  }

  get tokenDuration(): number {
    if (!this.token) {
      return 0;
    }
    return this.tokenExpirationData.getTime() - new Date().getTime();
  }
}

export interface IAuthData {
  userId: string;
  email: string;
  token: string;
  tokenExpirationTime: string;
}

export enum StorageKey {
  AUTH_DATA = 'authData',
}
