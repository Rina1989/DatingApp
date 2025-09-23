import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AccountService } from '../../../Core/services/account-service';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { ToastService } from '../../../Core/services/toast-service';

@Component({
  selector: 'app-nav',
  imports: [FormsModule, RouterLink, RouterLinkActive],
  templateUrl: './nav.html',
  styleUrl: './nav.css'
})
export class Nav {
  protected accountService = inject(AccountService);
  protected router = inject(Router);
  private toast = inject(ToastService);
  protected creds: any = {}
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

