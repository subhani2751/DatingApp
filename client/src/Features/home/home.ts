import { Component, Input, signal } from '@angular/core';
import { Register } from "../Account/register/register";
import { User } from '../../Types/User';

@Component({
  selector: 'app-home',
  imports: [Register],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home {
  // @Input({required:true}) membersFromapp: User[] =[];

  protected registerMode=signal(true);
  showRegister(value: boolean){
    this.registerMode.set(value);
  }
}
