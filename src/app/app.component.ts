import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { DashboardSidebarComponent } from "./main/dashboard/components/dashboard-sidebar/dashboard-sidebar.component";

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    DashboardSidebarComponent
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
