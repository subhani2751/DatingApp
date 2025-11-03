import { of } from 'rxjs';
import { AccountService } from './account-service';
import { inject, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class InitService {
  private accountService=inject(AccountService)
  init(){
    const userstring=localStorage.getItem('User');
    if(!userstring) return of(null) ;
    const user=JSON.parse(userstring);
    this.accountService.currentUser.set(user);
    return of(null)
  }
}
