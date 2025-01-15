import { Component } from '@angular/core';
import { DashboardSidebarComponent } from './dashboard-sidebar/dashboard-sidebar.component';

@Component({
  selector: 'app-dashboard',
  imports: [DashboardSidebarComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {

}
