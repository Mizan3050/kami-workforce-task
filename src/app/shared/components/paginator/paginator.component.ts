import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-paginator',
  imports: [],
  templateUrl: './paginator.component.html',
  styleUrl: './paginator.component.scss'
})
export class PaginatorComponent {
  start = input(0);
  end = input(0)

  previousPage = output<void>();
  nextPage = output<void>();
}
