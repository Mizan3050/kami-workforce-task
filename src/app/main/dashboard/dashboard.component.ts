import { Component, DestroyRef, OnInit, Signal, WritableSignal, inject, signal } from '@angular/core';
import { DashboardSidebarComponent } from './components/dashboard-sidebar/dashboard-sidebar.component';
import { AsyncPipe, NgFor, NgIf } from '@angular/common';
import { CommonRepositoryService } from '../../core/common/common-repository.service';
import { Observable, tap } from 'rxjs';
import { ListParams } from '../../core/models/list-params.model';
import { Photo } from '../photos/interface/photos.interface';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-dashboard',
  imports: [DashboardSidebarComponent, AsyncPipe, NgIf, NgFor],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {

  photos$!: Observable<Array<Photo>>;
  photosCount: WritableSignal<number> = signal(0);

  posts$!: Observable<Array<any>>;
  postsCount: WritableSignal<number> = signal(0);

  albumsCount: WritableSignal<number> = signal(0);

  summary_widgets = [
    {
      title: 'POSTS',
      count: this.postsCount,
      class: 'fas fa-comment-alt text-primary'
    },
    {
      title: 'ALBUMS',
      count: this.albumsCount,
      class: 'fas fa-images text-success'
    },
    {
      title: 'PHOTOS',
      count: this.photosCount,
      class: 'fas fa-camera text-warning'
    }
  ]

  #commonRepositoryService = inject(CommonRepositoryService);
  private destroyRef = inject(DestroyRef);

  ngOnInit(): void {
    this.getPhotos();
    this.getPosts();
    this.getAlbums();
  }

  getPhotos() {
    const params = new ListParams(null, 0, 20);
    this.photos$ = this.#commonRepositoryService.getPhotos(params).pipe(
      tap((photos) => {
        this.photosCount.set(photos.length);
      })
    )
  }

  getPosts() {
    const params = new ListParams(null, 0, 20);
    this.posts$ = this.#commonRepositoryService.getPosts(params).pipe(
      tap((posts) => {
        this.postsCount.set(posts.length);
      })
    )
  }

  getAlbums() {
    const params = new ListParams(null, 0, 20);
    this.#commonRepositoryService.getAlbums(params).pipe(
      tap((albums) => {
        this.albumsCount.set(albums.length);
      }),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe()
  }
}
