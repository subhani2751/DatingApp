import { AccountService } from './../Core/services/account-service';
import { HttpClient } from '@angular/common/http';
import { Component, inject, OnInit, signal } from '@angular/core';
import { Nav } from "../Layout/nav/nav";
import { lastValueFrom } from 'rxjs';
import { Home } from "../Features/home/home";
import { User } from '../Types/User';

@Component({
  selector: 'app-root',
  imports: [Nav, Home],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit{
  private accountService=inject(AccountService);
  private http =inject(HttpClient);
  protected readonly title = 'Dating App';
  protected Members = signal<User[]>([])



  // ngOnInit(): void {
  //   this.http.get("http://localhost:5277/api/Members/GetMembers").subscribe({
  //     next: reponse => this.Members.set(reponse),
  //     error: error=> console.log(error),
  //     complete: () => console.log("completed the Http request") 
  //   })
  // }

  async ngOnInit(){
    this.Members.set(await this.GetMembers());
    this.SetCurrentuser();
  }

  async GetMembers(){
    try {
      return lastValueFrom(this.http.get<User[]>("http://localhost:5277/api/Members/GetMembers"));
    } catch (e) {
      console.log(e);
      throw e;
    }
  }

  SetCurrentuser(){
    const userstring=localStorage.getItem('User');
    if(!userstring) return ;
    const user=JSON.parse(userstring);
    this.accountService.currentUser.set(user);
  }
}
