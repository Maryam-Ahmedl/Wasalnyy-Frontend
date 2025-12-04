import { Injectable } from '@angular/core';
import { environment } from '../../enviroments/enviroment';

declare const FB: any;
@Injectable({
  providedIn: 'root'
})
export class FacebookService {

  constructor() {}
  private initFacebookSdk(): Promise<void> {
    return new Promise((resolve) => {
      if (typeof FB !== 'undefined') {
        FB.init({
          appId: environment.facebookAppId,
          cookie: true,
          xfbml: true,
          version: 'v18.0'
        });
        resolve();
      }
      // else {
      //   // Wait for FB to be available
      //   window.addEventListener('load', () => {
      //     if (typeof FB !== 'undefined') {
      //       FB.init({
      //         appId: environment.facebookAppId,
      //         cookie: true,
      //         xfbml: true,
      //         version: 'v18.0'
      //       });
      //       resolve();
      //     }
      //   });
      // }
    });
  }

  async loginWithFacebook(): Promise<string> {
    await this.initFacebookSdk();

    return new Promise((resolve, reject) => {
      FB.login((response: any) => {
        if (response.authResponse && response.authResponse.accessToken) {
          console.log('Facebook login successful:', response);
          resolve(response.authResponse.accessToken);
        } else {
          console.log('Facebook login failed or cancelled:', response);
          reject('User cancelled login or did not fully authorize.');
        }
      }, {
        scope: 'public_profile,email',
        return_scopes: true
      });
    });
  }

  async getLoginStatus(): Promise<any> {
    await this.initFacebookSdk();

    return new Promise((resolve) => {
      FB.getLoginStatus((response: any) => {
        resolve(response);
      });
    });
  }

  async logout(): Promise<void> {
    await this.initFacebookSdk();

    return new Promise((resolve) => {
      FB.logout(() => {
        console.log('Logged out from Facebook');
        resolve();
      });
    });
  }

  async getUserProfile(): Promise<any> {
    await this.initFacebookSdk();

    return new Promise((resolve, reject) => {
      FB.api('/me', { fields: 'id,name,email,picture' }, (response: any) => {
        if (response && !response.error) {
          resolve(response);
        } else {
          reject(response.error);
        }
      });
    });
  }
}
