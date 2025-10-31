import { Component, inject, signal} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AccountService } from '../../Core/services/account-service';

@Component({
  selector: 'app-nav',
  imports: [FormsModule],
  templateUrl: './nav.html',
  styleUrl: './nav.css'
})
export class Nav {
  protected accountService=inject(AccountService);
  protected Creds:any = {}
  protected showPassword : boolean = true;

  login(){
    this.accountService.login(this.Creds).subscribe({
      next: result=> {
        console.log(result)
        this.Creds={};
      },
      error: error=> alert(error.message),
      complete : ()=>console.log("accountService.login request compleated")
    });
  }
  logout(){
    this.accountService.logout();
  }
}
