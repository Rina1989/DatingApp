import { Component, inject } from '@angular/core';
import { Nav } from './layout/nav/nav';
import { NgClass } from '@angular/common';
import { Home } from '../Features/home/home';
import { Router, RouterOutlet } from '@angular/router';


@Component({
  selector: 'app-root',
  imports: [Nav, Home, RouterOutlet,NgClass],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App{
  protected router=inject(Router)

}
