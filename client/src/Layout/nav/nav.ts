import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AccountService } from '../../Core/services/account-service';

@Component({
  selector: 'app-nav',
  imports: [FormsModule],
  templateUrl: './nav.html',
  styleUrl: './nav.css'
})
export class Nav {
  protected Creds:any = {}
  protected showPassword : boolean = true;
  private accountService=inject(AccountService)

  login(){
    this.accountService.login(this.Creds).subscribe({
      next: result=> console.log(result),
      error: error=> alert(error.message),
      complete : ()=>console.log("hi")
    });
  }
}
