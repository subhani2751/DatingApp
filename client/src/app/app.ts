import { Component, inject} from '@angular/core';
import { Nav } from "../Layout/nav/nav";
import { Router, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [Nav,  RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App{
  protected router=inject(Router);



  // ngOnInit(): void {
  //   this.http.get("http://localhost:5277/api/Members/GetMembers").subscribe({
  //     next: reponse => this.Members.set(reponse),
  //     error: error=> console.log(error),
  //     complete: () => console.log("completed the Http request") 
  //   })
  // }


}
