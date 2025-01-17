import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { DashboardSidebarComponent } from "./core/components/dashboard-sidebar/dashboard-sidebar.component";
import { DashboardSidebarMobileComponent } from './core/components/dashboard-sidebar-mobile/dashboard-sidebar-mobile.component';
import { NgIf } from '@angular/common';
import { HeaderComponent } from './core/components/header/header.component';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    DashboardSidebarComponent,
    DashboardSidebarMobileComponent,
    HeaderComponent
],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'kami-workforce-task';

  constructor() {
    console.log("Kami Work Force App")
  }
}
