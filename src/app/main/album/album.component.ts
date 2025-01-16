import { AsyncPipe, NgFor, NgIf } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Observable, debounceTime, distinctUntilChanged, map, tap } from 'rxjs';
import { ListParams } from '../../core/models/list-params.model';
import { CommonRepositoryService } from '../../core/services/common-repository.service';
import { LoaderComponent } from "../../shared/components/loader/loader.component";
import { PaginatorComponent } from "../../shared/components/paginator/paginator.component";
import { Album } from './interface/album.interface';

@Component({
  selector: 'app-album',
  imports: [LoaderComponent, PaginatorComponent, ReactiveFormsModule, NgIf, AsyncPipe, NgFor, RouterLink],
  templateUrl: './album.component.html',
  styleUrl: './album.component.scss'
})
export class AlbumComponent {
  #commonRepositoryService = inject(CommonRepositoryService);
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

  ngOnInit(): void {
    this.getAlbums();
    this.searchControl.valueChanges.pipe(
      distinctUntilChanged(),
      debounceTime(1100),
      tap((v) => {
        this.#commonRepositoryService.setQueryParam({ search: v })
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
      map((posts) => posts.filter((post) => post.title.includes(this.searchControl.value || ''))),
      map((posts) => {
        const sortQueryParam = this.sortQueryParam
        if (sortQueryParam?.length) {
          return posts.sort((a, b) => {
            if (sortQueryParam === '-id') {
              return a.id - b.id
            } else {
              return b.id - a.id
            }
          })
        } else {
          return posts
        }
      })
    )
  }

  sortChange(e: HTMLSelectElement) {
    if (e.value === 'id' || e.value === '-id') {
      this.sortQueryParam = e.value
      this.#commonRepositoryService.setQueryParam({ sort: e.value })
    } else {
      this.sortQueryParam = ''
      this.#commonRepositoryService.setQueryParam({ sort: '' })
    }
    this.getAlbums()
  }

  nextPage() {
    this.#paginator._start = this.#paginator._start + this.#paginator._limit;
    this.#commonRepositoryService.setQueryParam(this.#paginator)
    this.#commonRepositoryService.albumsRefresh();
    this.getAlbums()
  }

  previousPage() {
    if (this.#paginator._start - this.#paginator._limit >= 0) {
      this.#paginator._start = this.#paginator._start - this.#paginator._limit;
      this.#commonRepositoryService.setQueryParam(this.#paginator)
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
    this.#commonRepositoryService.clearQueryParams();
    this.#commonRepositoryService.albumsRefresh();
    this.getAlbums()
  }
}
