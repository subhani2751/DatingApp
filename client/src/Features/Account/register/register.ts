import { AccountService } from './../../../Core/services/account-service';
import { FormsModule } from '@angular/forms';
import { Component, inject, input, output } from '@angular/core';
import { RegisterCreds, User } from '../../../Types/User';

@Component({
  selector: 'app-register',
  imports: [FormsModule],
  templateUrl: './register.html',
  styleUrl: './register.css'
})
export class Register {
  // membersFromhome=input.required<User[]>();
  private accountService=inject(AccountService);
  CancelRegister=output<boolean>();
  protected creds={} as RegisterCreds;

  register(){
    this.accountService.register(this.creds).subscribe({
      next: result=> {
        console.log(result);
        this.cancel();
      },
      error: error => console.log(error)
    })
  }
  cancel(){
    this.CancelRegister.emit(false);
  }
}
