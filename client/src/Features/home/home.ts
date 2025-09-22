import { Component, Input, signal } from '@angular/core';
import { Register } from "../account/register/register";
import { User } from '../../Types/User';

@Component({
  selector: 'app-home',
  imports: [Register],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home {
  // @Input({required:true}) memberFromApp:User[]=[];
protected registerMode=signal(false);

showRegister(value:boolean){
  this.registerMode.set(value);
}

}
