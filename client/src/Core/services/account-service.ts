import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { LoginCreds, RegisterCreds, User } from '../../Types/User';
import { tap } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  private http=inject(HttpClient);
  currentUser=signal<User |null>(null)

   private baseUrl=environment.apiUrl;

  register(creds: RegisterCreds){
    return this.http.post<User>(this.baseUrl+ 'account/register',creds).pipe(
      tap(user=>{
        if(user){
          this.setCurrentUser(user);
        }
      })
    )
  }

  login(Creds: LoginCreds){
    return this.http.post<User>(this.baseUrl + 'account/login', Creds).pipe(
      tap(user => {
        if (user) {
          this.setCurrentUser(user);
        }
      })
    )
  }
  setCurrentUser(user: User) {
    this.currentUser.set(user);
    localStorage.setItem('User', JSON.stringify(user));
  }

  logout(){
    this.currentUser.set(null)
    localStorage.removeItem('User');
  }
}
