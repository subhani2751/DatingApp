import { Component, inject, OnInit, signal} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AccountService } from '../../Core/services/account-service';
import { Router, RouterLink, RouterLinkActive } from "@angular/router";
import { ToastService } from '../../Core/services/toast-service';
import { themes } from '../theme';
import { BusyService } from '../../Core/services/busy-service';

@Component({
  selector: 'app-nav',
  imports: [FormsModule, RouterLink, RouterLinkActive],
  templateUrl: './nav.html',
  styleUrl: './nav.css'
})
export class Nav implements OnInit {
  protected busyService = inject(BusyService);
  protected accountService=inject(AccountService);
  private router=inject(Router);
  private toast=inject(ToastService);
  protected Creds:any = {}
  protected selectedTheme = signal<string>(localStorage.getItem('theme') || 'light');
  protected themes = themes;
  protected showPassword : boolean = true;

  ngOnInit(): void {
        document.documentElement.setAttribute('data-theme',this.selectedTheme());
  }

  handleSelectTheme(theme: string){
    this.selectedTheme.set(theme);
    localStorage.setItem('theme',theme);
    document.documentElement.setAttribute('data-theme',theme);
    const elem = document.activeElement as HTMLDivElement;
    if(elem) elem.blur();
  }

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
