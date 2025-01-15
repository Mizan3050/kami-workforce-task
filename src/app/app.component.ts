import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TooltipModule } from 'ngx-bootstrap/tooltip';

@Component({
  selector: 'app-root',
  imports: [
    TooltipModule,
    RouterOutlet
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
