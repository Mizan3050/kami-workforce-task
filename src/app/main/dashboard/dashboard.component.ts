import { AsyncPipe, NgFor, NgIf } from '@angular/common';
import { Component, DestroyRef, OnInit, WritableSignal, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router, RouterLink } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { CommonRepositoryService } from '../../core/services/common-repository.service';
import { ListParams } from '../../core/models/list-params.model';
import { LoaderComponent } from "../../shared/components/loader/loader.component";
import { Photo } from '../photos/interface/photos.interface';

@Component({
  selector: 'app-dashboard',
  imports: [AsyncPipe, NgIf, NgFor, LoaderComponent, RouterLink],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {

  photos$!: Observable<Array<Photo>>;
  photosCount: WritableSignal<number> = signal(0);
  photosLoading: WritableSignal<boolean> = signal(false);

  posts$!: Observable<Array<any>>;
  postsCount: WritableSignal<number> = signal(0);
  postsLoading: WritableSignal<boolean> = signal(false);

  albumsCount: WritableSignal<number> = signal(0);

  summary_widgets = [
    {
      title: 'POSTS',
      count: this.postsCount,
      class: 'fas fa-comment-alt text-primary',
      path: '/posts'
    },
    {
      title: 'ALBUMS',
      count: this.albumsCount,
      class: 'fas fa-images text-success',
      path: '/albums'
    },
    {
      title: 'PHOTOS',
      count: this.photosCount,
      class: 'fas fa-camera text-warning',
      path: '/photos'
    }
  ]

  #commonRepositoryService = inject(CommonRepositoryService);
  #router = inject(Router);
  private destroyRef = inject(DestroyRef);

  ngOnInit(): void {
    this.getPhotos();
    this.getPosts();
    this.getAlbums();
  }

  getPhotos() {
    const params = new ListParams(0, 20);
    this.photosLoading.set(true);
    this.photos$ = this.#commonRepositoryService.getPhotos(params).pipe(
      tap((photos) => {
        this.photosLoading.set(false);
        this.photosCount.set(photos.length);
      })
    )
  }

  goToPhotoDetail(id: number) {
    this.#router.navigate(['photos', id])
  }

  goToPostDetail(id: number) {
    this.#router.navigate(['posts', id])
  }

  getPosts() {
    const params = new ListParams(0, 20);
    this.postsLoading.set(true);
    this.posts$ = this.#commonRepositoryService.getPosts(params).pipe(
      tap((posts) => {
        this.postsLoading.set(false);
        this.postsCount.set(posts.length);
      })
    )
  }

  getAlbums() {
    const params = new ListParams(0, 20);
    this.#commonRepositoryService.getAlbums(params).pipe(
      tap((albums) => {
        this.albumsCount.set(albums.length);
      }),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe()
  }
}
