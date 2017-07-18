import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { tokenNotExpired, JwtHelper } from 'angular2-jwt';

import { Headers, Http } from '@angular/http';

import 'rxjs/add/operator/toPromise';

@Injectable()
export class AuthService {

  private headers = new Headers({
    'Content-Type': 'application/x-www-form-urlencoded'
  });

  private serverUrl = 'http://localhost:1234';  // URL to backend

  // Create a stream of logged in status to communicate throughout app
  loggedIn: boolean;
  loggedIn$ = new BehaviorSubject<boolean>(this.loggedIn);

  constructor(private router: Router, private http: Http) {
    // If authenticated, set local profile property and update login status subject
    if (this.authenticated) {
      this.setLoggedIn(true);
    }
  }

  setLoggedIn(value: boolean) {
    // Update login status subject
    this.loggedIn$.next(value);
    this.loggedIn = value;
  }

  register(body): Promise<any> {
    const data = `firstName=${body.firstName}&middleName=${body.middleName}&lastName=${body.lastName}&city=${body.city}&state=${body.state}&country=${body.country}&email=${body.email}&username=${body.username}&password=${body.password}&phone=${body.phone}`;

    return this.http
      .post(`${this.serverUrl}/register`, data, { headers: this.headers })
      .toPromise()
      .then(res => res.json())
      .catch(this.handleError);
  }

  login(body): Promise<any> {

    const data = `username=${body.username}&password=${body.password}`;

    return this.http
      .post(`${this.serverUrl}/login`, data, { headers: this.headers })
      .toPromise()
      .then(res => res.json())
      .then(res => {
        return this.handleAuth(res)
      })
      .catch(this.handleError);
  }

  handleAuth(authResult): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        if (authResult.success && authResult.token) {
          window.location.hash = '';
          this._getProfile(authResult);
        }
        resolve(authResult)
      } catch (e) {
        reject(e)
      }
    })
  }

  private _getProfile(authResult) {
    const jwt = new JwtHelper()
    const decoded = jwt.decodeToken(authResult.token)
    const profile = decoded.data;

    this._setSession(authResult, profile)
  }

  private _setSession(authResult, profile) {
    return new Promise((resolve, reject) => {
      try {
        // Save session data and update login status subject
        localStorage.setItem('token', authResult.token);
        // localStorage.setItem('id_token', authResult.idToken);
        localStorage.setItem('profile', JSON.stringify(profile));
        this.setLoggedIn(true);
        resolve(true)
      } catch (err) {
        reject(err);
      }
    })
  }

  logout() {
    // Remove tokens and profile and update login status subject
    localStorage.removeItem('token');
    localStorage.removeItem('profile');
    this.router.navigate(['/']);
    this.setLoggedIn(false);
  }

  get authenticated() {
    // Check if there's an unexpired access token
    return tokenNotExpired('token');
  }

  private handleError(error: any): Promise<any> {
    // console.error('An error occurred', error); // for demo purposes only
    return Promise.reject(error.message || error);
  }

}
