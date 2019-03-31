import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
// import * as jwt from 'jsonwebtoken';
class DecodedToken {
  exp: number = 0;
  username: string = '';
}
@Injectable()
export class AuthService {
  private decodedToken;
  constructor(private http: HttpClient) {
    // this.decodedToken =
    //   JSON.parse(localStorage.getItem('swu_meta')) || new DecodedToken();
  }
  private saveToken(token: string): string {
    // this.decodedToken = jwt.decode(token);
    this.decodedToken = this.parseJwt(token);
    localStorage.setItem('swu_auth', token);
    localStorage.setItem('swu_meta', JSON.stringify(this.decodedToken));
    // console.log(this.parseJwt());
    return token;
  }
  public logout() {
    localStorage.removeItem('swu_auth');
    localStorage.removeItem('swu_meta');
    this.decodedToken = null;
  }
  public register(user: any): Observable<any> {
    return this.http.post<Observable<any>>('api/v1/users/register', user);
  }
  public login(user: any): Observable<any> {
    return this.http.post<Observable<any>>('api/v1/users/auth', user).pipe(
      map((token: any) => {
        // console.log(token);
        return this.saveToken(token.token);
      })
    );
  }
  public isAuthenticated(): boolean {
    this.decodedToken = JSON.parse(localStorage.getItem('swu_meta'));
    if (!this.decodedToken) {
      return false;
    }
    const tokenexp = this.decodedToken.exp;
    return Date.now() / 1000 < tokenexp;
  }
  getUserName() {
    if (this.decodedToken) {
      return this.decodedToken.username;
    }
    return 'Guest';
  }
  getToken() {
    let token = localStorage.getItem('swu_auth');
    if (token) {
      return token;
    }
    return null;
  }
  parseJwt(token) {
    // const token = this.getJwt();
    // if (!token) {
    //   return null;
    // }
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace('-', '+').replace('_', '/');
    return JSON.parse(window.atob(base64));
  }
  getJwt() {
    const token = localStorage.getItem('swu_auth');
    if (token === null) {
      return null;
    }
    return token;
  }
}
