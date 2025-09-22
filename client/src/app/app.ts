import { HttpClient } from '@angular/common/http';
import { Component, inject, OnInit, signal } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { Nav } from './layout/nav/nav';
import { AccountService } from '../Core/services/account-service';
import { JsonPipe } from '@angular/common';
import { Home } from '../Features/home/home';
import { User } from '../Types/User';

@Component({
  selector: 'app-root',
  imports: [Nav,Home],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  private accountService = inject(AccountService);
  private http = inject(HttpClient);
  protected title = 'App';
  // protected members:any;
  protected members = signal<User[]>([]);

  async ngOnInit() {
    // this.http.get('https://localhost:5037/api/members').subscribe({
    //   // next: response=>console.log(response),
    //   next:response=>this.members.set(response),
    //   error:error=>console.log(error),
    //   complete:()=>console.log('Complete the http request')
    this.members.set(await this.getMembers())
    this.setCurrentUser();
    console.log(this.members);
  }

  setCurrentUser(){
    const userString=localStorage.getItem('user');
    if(!userString)return;
    const user=JSON.parse(userString)
    this.accountService.currentUser.set(user);

  }
  async getMembers() {
    try {
      return lastValueFrom(this.http.get<User[]>('https://localhost:5037/api/members'));
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}
