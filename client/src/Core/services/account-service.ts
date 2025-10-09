import { HttpClient, JsonpInterceptor } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { LoginCreds, RegisterCreds, User } from '../../Types/User';
import { tap } from 'rxjs';
import { environment } from '../../environments/environment.development';
import { LikesService } from './likes-service';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  private http = inject(HttpClient);
  private likesService=inject(LikesService);
  currentUser = signal<User | null>(null);
  baseUrl = environment.apiUrl;
  register(creds: RegisterCreds) {
    return this.http.post<User>(this.baseUrl + 'AccountContoller/register', creds).pipe(                //Presistant storage from browser
      tap(user => {
        if (user) {
          this.setCurrentUser(user)
        }
      })
    )
  }

  login(creds: LoginCreds) {
    return this.http.post<User>(this.baseUrl + 'AccountContoller/login', creds).pipe(                //Presistant storage from browser
      tap(user => {
        if (user) {
          this.setCurrentUser(user)
        }
      })
    )
  }

  setCurrentUser(user: User) {
    localStorage.setItem('user', JSON.stringify(user))
    this.currentUser.set(user)
    this.likesService.getLikeIds();
  }

  logout() {
    localStorage.removeItem('user');
    localStorage.removeItem('filters');
    this.currentUser.set(null);
  }
}
