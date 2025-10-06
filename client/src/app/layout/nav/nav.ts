import { Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AccountService } from '../../../Core/services/account-service';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { ToastService } from '../../../Core/services/toast-service';
import { theme } from '../../../Layout/theme';
import { BusyService } from '../../../Core/services/busy-service';

@Component({
  selector: 'app-nav',
  imports: [FormsModule, RouterLink, RouterLinkActive],
  templateUrl: './nav.html',
  styleUrl: './nav.css'
})
export class Nav implements OnInit{
  protected accountService = inject(AccountService);
  protected busyService=inject(BusyService);
  protected router = inject(Router);
  private toast = inject(ToastService);
  protected creds: any = {}
  protected selectedTheme=signal<string>(localStorage.getItem('theme')||'light');
  protected theme=theme;

  ngOnInit(): void {
    document.documentElement.setAttribute('data-theme',this.selectedTheme());
  }

handleSelectTheme(theme:string){
this.selectedTheme.set(theme);
localStorage.setItem('theme',theme);
document.documentElement.setAttribute('data-theme',theme);
const elem=document.activeElement as HTMLDivElement;
if(elem) elem.blur();
}

  //protected loggedIn = signal(false);
  login() {
    this.accountService.login(this.creds).subscribe({
      // next: result => {
      next:()=>{
        //this.loggedIn.set(true);
        this.router.navigateByUrl("/members");
        this.toast.success('logged in successfully');
        
        this.creds = {};
      },
      error: error => {
        this.toast.error(error.error);
        console.log(error);
      }
    });
  }
  logout() {
    //this.loggedIn.set(false);
    this.accountService.logout();
    this.router.navigateByUrl("/");
  }
}

