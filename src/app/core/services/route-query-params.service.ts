import { Injectable, signal } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class RouteQueryParamsService {

  constructor(private router: Router, private activatedRoute: ActivatedRoute) { }

  setQueryParam(params: any): void {
    // Retrieve existing query parameters
    const queryParams = this.activatedRoute.snapshot.queryParams;

    // Add or update a query parameter (e.g., 'filter')
    const updatedQueryParams = { ...queryParams, ...params };

    // Navigate with the updated query parameters
    this.router.navigate([], {
      relativeTo: this.activatedRoute, // Keep the current route
      queryParams: updatedQueryParams,
      queryParamsHandling: 'merge', // Merge with existing query params
    });
  }

  clearQueryParams() {
    this.router.navigate([], {
      relativeTo: this.activatedRoute
    });
  }
}
