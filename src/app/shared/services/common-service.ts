import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ValidUsers } from '../constants/project.constant';

@Injectable({
  providedIn: 'root'
})
export class CommonService {
  /**
   * Holds the currently logged-in user in memory
   */
  private currentUser: any = null;

  constructor(private router: Router) { }

  /**
   * Authenticates the user using a predefined list of valid users
   */
  login(email: string, password: string): boolean {
    const user = ValidUsers.find(u => u.email === email && u.password === password);
    if (user) {
      this.currentUser = user;
      localStorage.setItem('loggedUser', JSON.stringify(user));
      return true;
    }
    return false;
  }

  /**
   * Safely retrieves any value from localStorage
   * @param key key to retrieve
   * @returns parsed value or null
   */
  private getFromStorage(key: string): any {
    if (typeof window !== 'undefined' && localStorage) {
      return JSON.parse(localStorage.getItem(key) || 'null');
    }
    return null;
  }

  /**
   * Retrieves the current logged-in user from localStorage
   * @returns user object or null
   */
  getUser() {
    return this.getFromStorage('loggedUser');
  }

  /**
   * Logs out the user by clearing localStorage and navigating to login page
   */
  logout() {
    this.currentUser = null;
    if (typeof window !== 'undefined') {
      localStorage.removeItem('loggedUser');
    }
    this.router.navigate(['/login']);
  }

  /**
   * Checks if a user is currently logged in
   */
  isLoggedIn(): boolean {
    return !!this.getUser();
  }

  urlLogout(): void {
    this.currentUser = null;
    if (typeof window !== 'undefined') {
      localStorage.removeItem('loggedUser');
    }
  }
}
