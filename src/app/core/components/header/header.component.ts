import { AsyncPipe, NgIf } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { Observable, filter, map, mergeMap, tap } from 'rxjs';

@Component({
  selector: 'app-header',
  imports: [NgIf, AsyncPipe],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit {

  #router = inject(Router)
  #activatedRoute = inject(ActivatedRoute)
  title = signal('');
  isVisible$!: Observable<boolean>;

  ngOnInit(): void {
    this.isVisible$ = this.#router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      map(() => this.#activatedRoute),
      map(route => {
        while (route.firstChild) {
          route = route.firstChild;
        }
        return route;
      }),
      filter(route => route.outlet === 'primary'),
      mergeMap(route => route.data),
      tap(() =>
        this.title.set(this.#activatedRoute.firstChild?.routeConfig?.title as string || '')
      ),
      map(event => event['showNav'] === false ? false : true)
    )
  }

}
