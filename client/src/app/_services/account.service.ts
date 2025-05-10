import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { tap } from 'rxjs';

import { User } from '../_models/user.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AccountService {
  baseUrl = environment.apiUrl;
  currentUser = signal<User | null>(null);
  private http = inject(HttpClient);

  register(model: any) {
    return this.http.post<User>(this.baseUrl + 'account/register', model).pipe(
      tap(user => {
        if (user) {
          this.currentUser.set(user);
          this.persistCurrentUser();
        }
      })
    );
  }

  login(model: any) {
    return this.http.post<User>(this.baseUrl + 'account/login', model).pipe(
      tap(user => {
        if (user) {
          this.currentUser.set(user);
          this.persistCurrentUser();
        }
      })
    );
  }

  logout() {
    localStorage.removeItem('user');
    this.currentUser.set(null);
  }

  getCurrentUser() {
    const userString = localStorage.getItem('user');
    if (!userString) return;
    const user: User = JSON.parse(userString);
    this.currentUser.set(user);
  }

  persistCurrentUser() {
    localStorage.setItem('user', JSON.stringify(this.currentUser()));
  }

  updateUserMainPhoto(photoUrl: string) {
    this.currentUser.update(user => {
      if (!user) return user;
      return {...user, photoUrl};
    });

    this.persistCurrentUser();
  }
}
