import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { tokenNotExpired } from 'angular2-jwt';

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

  register(data) : Promise<any> {
    return this.http
      .post(`${this.serverUrl}/register`, JSON.stringify(data), {headers: this.headers})
      .toPromise()
      .then(res => res.json())
      .catch(this.handleError);
  }
	
  login(body) : Promise<any> {

    var data = `username=${body.username}&password=${body.password}`
	  return this.http
      .post(`${this.serverUrl}/login`, data, {headers: this.headers})
      .toPromise()
      .then(res => res.json())
      .then(res => {
        console.log('logged response', res)
        this.handleAuth(res)
      })
      .catch(err => {
        console.log('login error', err)
      });
  }

  handleAuth(authResult) {
    if (authResult.success && authResult.token) {
      window.location.hash = '';
      this._getProfile(authResult);
      this.router.navigate(['/dashboard']);
    } else if (authResult.error) {
      this.router.navigate(['/login']);
      // console.error(`Error: ${err.error}`);
    }
  }

  private _getProfile(authResult) {
    // Use access token to retrieve user's profile and set session
    // return this.http
    //   .get(`${this.serverUrl}/profile`)
    //   .toPromise()
    //   .then(res => res.json())
    //   .catch(this.handleError)
    var profile = {
      
    }
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
      }
      catch(err){
        reject(err)
      }
    })
  }

  logout() {
    // Remove tokens and profile and update login status subject
    localStorage.removeItem('token');
    // localStorage.removeItem('id_token');
    localStorage.removeItem('profile');
    this.router.navigate(['/']);
    this.setLoggedIn(false);
  }

  get authenticated() {
    // Check if there's an unexpired access token
    return tokenNotExpired('token');
  }
  
  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error); // for demo purposes only
    return Promise.reject(error.message || error);
  }

}
