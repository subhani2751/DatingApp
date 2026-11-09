import { Component, inject, Input, signal } from '@angular/core';
import { Register } from "../Account/register/register";
import { User } from '../../Types/User';
import { AccountService } from '../../Core/services/account-service';

@Component({
  selector: 'app-home',
  imports: [Register],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home {
  // @Input({required:true}) membersFromapp: User[] =[];

  protected registerMode=signal(false);
  protected accountservice = inject(AccountService);
  showRegister(value: boolean){
    this.registerMode.set(value);
  }
}
