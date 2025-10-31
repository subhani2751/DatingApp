import { Component, inject, signal} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AccountService } from '../../Core/services/account-service';
import { Router, RouterLink, RouterLinkActive } from "@angular/router";
import { ToastService } from '../../Core/services/toast-service';

@Component({
  selector: 'app-nav',
  imports: [FormsModule, RouterLink, RouterLinkActive],
  templateUrl: './nav.html',
  styleUrl: './nav.css'
})
export class Nav {
  protected accountService=inject(AccountService);
  private router=inject(Router);
  private toast=inject(ToastService);
  protected Creds:any = {}
  protected showPassword : boolean = true;

  login(){
    this.accountService.login(this.Creds).subscribe({
      next: ()=> {
        this.router.navigateByUrl('/Members')
        this.toast.success('logged in successfully')
        this.Creds={};
      },
      error: error=> {
        this.toast.error(error.error);
        console.log(error)
      },
      complete : ()=>console.log("accountService.login request compleated")
    });
  }
  logout(){
    this.accountService.logout();
     this.router.navigateByUrl('/')
  }
}
