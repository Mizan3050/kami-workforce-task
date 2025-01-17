import { AsyncPipe, NgFor, NgIf } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable, debounceTime, distinctUntilChanged, map, tap } from 'rxjs';
import { ListParams } from '../../core/models/list-params.model';
import { CommonRepositoryService } from '../../core/services/common-repository.service';
import { LoaderComponent } from "../../shared/components/loader/loader.component";
import { PaginatorComponent } from "../../shared/components/paginator/paginator.component";
import { Album } from './interface/album.interface';
import { RouteQueryParamsService } from '../../core/services/route-query-params.service';

@Component({
  selector: 'app-album',
  imports: [LoaderComponent, PaginatorComponent, ReactiveFormsModule, NgIf, AsyncPipe, NgFor],
  templateUrl: './album.component.html',
  styleUrl: './album.component.scss'
})
export class AlbumComponent {
  #commonRepositoryService = inject(CommonRepositoryService);
  #routeQueryParamsService = inject(RouteQueryParamsService)
  #route = inject(ActivatedRoute);

  searchQueryParam = this.#route.snapshot.queryParamMap.get('search') || '';
  sortQueryParam = this.#route.snapshot.queryParamMap.get('sort') || '';
  startQueryParam = this.#route.snapshot.queryParamMap.get('_start') || 0;
  limitQueryParam = this.#route.snapshot.queryParamMap.get('_limit') || 20;
  albumsLoading = signal(false);
  albums$!: Observable<Array<Album>>

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

  images = [
    'https://placehold.co/50x50/d8248a/FFFFFF/png',
    'https://placehold.co/50x50/a929a2/FFFFFF/png',
    'https://placehold.co/50x50/db537c/FFFFFF/png'
  ]

  ngOnInit(): void {
    this.getAlbums();
    this.searchControl.valueChanges.pipe(
      distinctUntilChanged(),
      debounceTime(1100),
      tap((v) => {
        this.#routeQueryParamsService.setQueryParam({ search: v })
        this.getAlbums()
      })
    ).subscribe()
  }

  getAlbums() {
    const { _limit, _start } = this.#paginator;
    const params: ListParams = new ListParams(_start, _limit);
    this.albumsLoading.set(true);
    this.albums$ = this.#commonRepositoryService.getAlbums(params).pipe(
      tap(() => {
        this.albumsLoading.set(false)
      }),
      map((albums) => albums.filter((album) => album.title.includes(this.searchControl.value?.toLowerCase()  || ''))),
      map((albums) => {
        const sortQueryParam = this.sortQueryParam || ''
        if (sortQueryParam.length) {
          return albums.sort((a, b) => {
            if (sortQueryParam === '-id') {
              return a.id - b.id
            } else {
              return b.id - a.id
            }
          })
        } else {
          return albums
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
    this.getAlbums()
  }

  nextPage() {
    this.#paginator._start = this.#paginator._start + this.#paginator._limit;
    this.#routeQueryParamsService.setQueryParam(this.#paginator)
    this.#commonRepositoryService.albumsRefresh();
    this.getAlbums()
  }

  previousPage() {
    if (this.#paginator._start - this.#paginator._limit >= 0) {
      this.#paginator._start = this.#paginator._start - this.#paginator._limit;
      this.#routeQueryParamsService.setQueryParam(this.#paginator)
      this.#commonRepositoryService.albumsRefresh();
      this.getAlbums()
    }
  }

  clearFilters() {
    this.#paginator = {
      _start: 0,
      _limit: 20
    }
    this.searchControl.patchValue('', { emitEvent: false })
    this.sortQueryParam = '';
    this.#routeQueryParamsService.clearQueryParams();
    this.#commonRepositoryService.albumsRefresh();
    this.getAlbums()
  }
}
