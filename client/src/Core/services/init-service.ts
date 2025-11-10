import { LikesService } from './likes-service';
import { of } from 'rxjs';
import { AccountService } from './account-service';
import { inject, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class InitService {
  private accountService=inject(AccountService);
  private likesservice = inject(LikesService);
  init(){
    const userstring=localStorage.getItem('User');
    if(!userstring) return of(null) ;
    const user=JSON.parse(userstring);
    this.accountService.currentUser.set(user);
    this.likesservice.getLikeIds();
    return of(null)
  }
}
