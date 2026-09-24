import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly AUTH_KEY = 'firmo_auth_token';
  private platformId = inject(PLATFORM_ID);

  constructor() {}

  login() {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem(this.AUTH_KEY, 'true');
    }
  }

  logout() {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem(this.AUTH_KEY);
    }
  }

  isLoggedIn(): boolean {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem(this.AUTH_KEY) === 'true';
    }
    return false;
  }
}
