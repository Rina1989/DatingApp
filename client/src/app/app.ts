import { HttpClient } from '@angular/common/http';
import { Component, inject, OnInit, signal } from '@angular/core';
import { lastValueFrom } from 'rxjs';

@Component({
  selector: 'app-root',
  imports: [],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit{
    private http=inject(HttpClient);
  protected title = 'App';
  // protected members:any;
  protected members=signal<any>([]);
  
  async ngOnInit() {
    // this.http.get('https://localhost:5037/api/members').subscribe({
    //   // next: response=>console.log(response),
    //   next:response=>this.members.set(response),
    //   error:error=>console.log(error),
    //   complete:()=>console.log('Complete the http request')
    this.members.set(await this.getMembers())
    console.log(this.members);
  }
    async getMembers(){
      try {
        return lastValueFrom(this.http.get('https://localhost:5037/api/members'));
      } catch (error) {
        console.log(error);
        throw error;
      }
    }
}
