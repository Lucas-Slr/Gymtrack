import { Component } from '@angular/core';
import { SideBar } from '../../components/side-bar/side-bar';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-main-layout',
  templateUrl: './main-layout.html',
  styleUrl: './main-layout.scss',
  standalone: true,
  imports: [SideBar, RouterOutlet]
})
export class MainLayout {}
