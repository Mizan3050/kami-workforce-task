import { AsyncPipe, NgFor, NgIf } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Observable, debounceTime, distinctUntilChanged, map, tap } from 'rxjs';
import { CommonRepositoryService } from '../../core/services/common-repository.service';
import { ListParams } from '../../core/models/list-params.model';
import { LoaderComponent } from "../../shared/components/loader/loader.component";
import { Post } from './interface/post.interface';
import { PaginatorComponent } from "../../shared/components/paginator/paginator.component";

@Component({
  selector: 'app-posts',
  imports: [LoaderComponent, NgIf, AsyncPipe, NgFor, RouterLink, ReactiveFormsModule, PaginatorComponent],
  templateUrl: './posts.component.html',
  styleUrl: './posts.component.scss'
})
export class PostsComponent implements OnInit {

  #commonRepositoryService = inject(CommonRepositoryService);
  #route = inject(ActivatedRoute);

  searchQueryParam = this.#route.snapshot.queryParamMap.get('search') || '';
  sortQueryParam = this.#route.snapshot.queryParamMap.get('sort') || '';
  startQueryParam = this.#route.snapshot.queryParamMap.get('_start') || 0;
  limitQueryParam = this.#route.snapshot.queryParamMap.get('_limit') || 20;
  postsLoading = signal(false);
  posts$!: Observable<Array<Post>>

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
    this.getPosts();
    this.searchControl.valueChanges.pipe(
      distinctUntilChanged(),
      debounceTime(1100),
      tap((v) => {
        this.#commonRepositoryService.setQueryParam({ search: v })
        this.getPosts()
      })
    ).subscribe()
  }

  getPosts() {
    const { _limit, _start } = this.#paginator;
    const params: ListParams = new ListParams(_start, _limit);
    this.postsLoading.set(true);
    this.posts$ = this.#commonRepositoryService.getPosts(params).pipe(
      tap(() => {
        this.postsLoading.set(false)
      }),
      map((posts) => posts.filter((post) => post.title.includes(this.searchControl.value || ''))),
      map((posts) => {
        const sortQueryParam = this.sortQueryParam || ''
        if (sortQueryParam.length) {
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
    this.getPosts()
  }

  nextPage() {
    this.#paginator._start = this.#paginator._start + this.#paginator._limit;
    this.#commonRepositoryService.setQueryParam(this.#paginator)
    this.#commonRepositoryService.postsRefresh();
    this.getPosts()
  }

  previousPage() {
    if (this.#paginator._start - this.#paginator._limit >= 0) {
      this.#paginator._start = this.#paginator._start - this.#paginator._limit;
      this.#commonRepositoryService.setQueryParam(this.#paginator)
      this.#commonRepositoryService.postsRefresh();
      this.getPosts()
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
    this.#commonRepositoryService.postsRefresh();
    this.getPosts()
  }
}
