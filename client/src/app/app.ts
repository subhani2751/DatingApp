import { HttpClient } from '@angular/common/http';
import { Component, inject, OnInit, signal } from '@angular/core';
import { Nav } from "../Layout/nav/nav";

@Component({
  selector: 'app-root',
  imports: [Nav],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit{
  private http =inject(HttpClient);
  protected readonly title = 'Dating App';
  protected Members = signal<any>([])
  ngOnInit(): void {
    this.http.get("http://localhost:5277/api/Members/GetMembers").subscribe({
      next: reponse => this.Members.set(reponse),
      error: error=> console.log(error),
      complete: () => console.log("completed the Http request") 
    })
  }
}
