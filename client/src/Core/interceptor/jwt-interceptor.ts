import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AccountService } from '../services/account-service';

export const jwtInterceptor: HttpInterceptorFn = (req, next) => {
  const accountservice=inject(AccountService);
  const user=accountservice.currentUser();

  if(user){
    req = req.clone({
      setHeaders: {
        authorization: `Bearer ${user.sToken}`
      }
    })
  }

  return next(req);

};
