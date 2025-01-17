import { NgIf, AsyncPipe, NgFor } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { LoaderComponent } from '../../shared/components/loader/loader.component';
import { PaginatorComponent } from '../../shared/components/paginator/paginator.component';
import { Observable, distinctUntilChanged, debounceTime, tap, map } from 'rxjs';
import { ListParams } from '../../core/models/list-params.model';
import { CommonRepositoryService } from '../../core/services/common-repository.service';
import { Photo } from './interface/photos.interface';
import { RouteQueryParamsService } from '../../core/services/route-query-params.service';

@Component({
  selector: 'app-photos',
  imports: [LoaderComponent, PaginatorComponent, ReactiveFormsModule, NgIf, AsyncPipe, NgFor],
  templateUrl: './photos.component.html',
  styleUrl: './photos.component.scss'
})
export class PhotosComponent {

  #commonRepositoryService = inject(CommonRepositoryService);
  #route = inject(ActivatedRoute);
  #routeQueryParamsService = inject(RouteQueryParamsService)
  
  searchQueryParam = this.#route.snapshot.queryParamMap.get('search') || '';
  sortQueryParam = this.#route.snapshot.queryParamMap.get('sort') || '';
  startQueryParam = this.#route.snapshot.queryParamMap.get('_start') || 0;
  limitQueryParam = this.#route.snapshot.queryParamMap.get('_limit') || 20;
  photosLoading = signal(false);
  photos$!: Observable<Array<Photo>>

  #paginator = {
    _start: +this.startQueryParam,
    _limit: +this.limitQueryParam
  }

  get start() {
    return this.#paginator._start
  }
  get end() {
    return this.#paginator._start + this.#paginator._limit
  }

  searchControl = new FormControl(this.searchQueryParam);

  ngOnInit(): void {
    this.getPhotos();
    this.searchControl.valueChanges.pipe(
      distinctUntilChanged(),
      debounceTime(1100),
      tap((v) => {
        this.#routeQueryParamsService.setQueryParam({ search: v })
        this.getPhotos()
      })
    ).subscribe()
  }

  getPhotos() {
    const { _limit, _start } = this.#paginator;
    const params: ListParams = new ListParams(_start, _limit);
    this.photosLoading.set(true);
    this.photos$ = this.#commonRepositoryService.getPhotos(params).pipe(
      tap(() => {
        this.photosLoading.set(false)
      }),
      map((photos) => photos.filter((photo) => photo.title.includes(this.searchControl.value || ''))),
      map((photos) => {
        const sortQueryParam = this.sortQueryParam || '';
        if (sortQueryParam.length) {
          return photos.sort((a, b) => {
            if (sortQueryParam === '-id') {
              return a.id - b.id
            } else {
              return b.id - a.id
            }
          })
        } else {
          return photos
        }
      })
    )
  }

  sortChange(e: HTMLSelectElement) {
    if (e.value === 'id' || e.value === '-id') {
      this.sortQueryParam = e.value
      this.#routeQueryParamsService.setQueryParam({ sort: e.value })
    } else {
      this.sortQueryParam = ''
      this.#routeQueryParamsService.setQueryParam({ sort: '' })
    }
    this.getPhotos()
  }

  nextPage() {
    this.#paginator._start = this.#paginator._start + this.#paginator._limit;
    this.#routeQueryParamsService.setQueryParam(this.#paginator)
    this.#commonRepositoryService.postsRefresh();
    this.getPhotos()
  }

  previousPage() {
    if (this.#paginator._start - this.#paginator._limit >= 0) {
      this.#paginator._start = this.#paginator._start - this.#paginator._limit;
      this.#routeQueryParamsService.setQueryParam(this.#paginator)
      this.#commonRepositoryService.postsRefresh();
      this.getPhotos()
    }
  }

  clearFilters() {
    this.#paginator = {
      _start: 0,
      _limit: 20
    }
    this.searchControl.patchValue('', { emitEvent: false })
    this.sortQueryParam = '';
    this.#routeQueryParamsService.setQueryParam(this.#paginator)
    this.#commonRepositoryService.postsRefresh();
    this.getPhotos()
  }
  
}
