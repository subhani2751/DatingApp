import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { LoginCreds, RegisterCreds, User } from '../../Types/User';
import { tap } from 'rxjs';
import { environment } from '../../environments/environment';
import { LikesService } from './likes-service';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  private http = inject(HttpClient);
  private likesService = inject(LikesService);
  currentUser = signal<User | null>(null)

  private baseUrl = environment.apiUrl;

  register(creds: RegisterCreds) {
    return this.http.post<User>(this.baseUrl + 'account/register', creds, { withCredentials: true }).pipe(
      tap(user => {
        if (user) {
          this.setCurrentUser(user);
          this.startTokenRefreshInterval();
        }
      })
    )
  }

  login(Creds: LoginCreds) {
    return this.http.post<User>(this.baseUrl + 'account/login', Creds, { withCredentials: true }).pipe(
      tap(user => {
        if (user) {
          this.setCurrentUser(user);
          this.startTokenRefreshInterval();
        }
      })
    )
  }
  setCurrentUser(user: User) {
    user.roles = this.getRolesFromToken(user);
    this.currentUser.set(user);
    this.likesService.getLikeIds();
  }

  refreshToken() {
    return this.http.post<User>(this.baseUrl + 'account/refresh-token', {}, { withCredentials: true })
  }

  startTokenRefreshInterval() {
    setInterval(() => {
      this.http.post<User>(this.baseUrl + 'account/refresh-token', {}, { withCredentials: true }).subscribe({
        next: user => {
          this.setCurrentUser(user);
        },
        error: () => {
          this.logout();
        }
      })
    }, 5 * 60 * 1000);
  }

  logout() {
    this.currentUser.set(null)
    this.likesService.clearLikeIds();
  }

  private getRolesFromToken(user: User): string[] {
    const payload = user.sToken.split('.')[1];
    const decoded = atob(payload);
    const jsonPayload = JSON.parse(decoded);
    return Array.isArray(jsonPayload.role) ? jsonPayload.role : [jsonPayload.role];
  }
}
