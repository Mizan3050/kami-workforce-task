import { Injectable, inject } from '@angular/core';
import { Observable, catchError, of, tap } from 'rxjs';
import { Album } from '../../main/album/interface/album.interface';
import { Photo } from '../../main/photos/interface/photos.interface';
import { Post } from '../../main/posts/interface/post.interface';
import { ListParams } from '../models/list-params.model';
import { CommonApiService } from './common-api.service';

@Injectable({
  providedIn: 'root'
})
export class CommonRepositoryService {

  commonApiService = inject(CommonApiService)
  cachedPhotos = new Set<Photo>();
  cachedAlbums = new Set<Album>();
  cachedPosts = new Set<Post>();
  cachedPhotosWithId = new Map<string, Photo>();
  cachedPostsWithId = new Map<string, Post>();
  getPhotos(params: ListParams) {
    if (this.cachedPhotos.size) {
      return of(Array.from(this.cachedPhotos))
    } else {
      return this.commonApiService.getPhotos(params).pipe(
        tap((photos) => {
          this.cachedPhotos = new Set(photos);
        }),
        catchError(() => {
          return of([])
        })
      )
    }
  }

  getPosts(params: ListParams) {
    if (this.cachedPosts.size) {
      return of(Array.from(this.cachedPosts))
    } else {
      return this.commonApiService.getPosts(params).pipe(
        tap((posts) => {
          this.cachedPosts = new Set(posts);
        }),
        catchError(() => {
          return of([])
        })
      )
    }
  }

  postsRefresh() {
    this.cachedPosts.clear();
  }
  albumsRefresh() {
    this.cachedAlbums.clear();
  }
  photosRefresh() {
    this.cachedPhotos.clear();
  }

  getAlbums(params: ListParams) {
    if (this.cachedAlbums.size) {
      return of(Array.from(this.cachedAlbums))
    } else {
      return this.commonApiService.getAlbums(params).pipe(
        tap((albums) => {
          this.cachedAlbums = new Set(albums);
        }),
        catchError(() => {
          return of([])
        })
      )
    }
  }

  getPhotoDetail(id: string): Observable<Photo | null> {
    if (this.cachedPhotosWithId.get(id)?.id) {
      return of(this.cachedPhotosWithId.get(id)) as Observable<Photo>
    } else {
      return this.commonApiService.getPhotoDetail(id).pipe(
        tap((photoDetail) => this.cachedPhotosWithId.set(id, photoDetail)),
        catchError(() => {
          return of(null)
        })
      )
    }
  }

  getPostDetail(id: string) {
    if (this.cachedPostsWithId.get(id)?.id) {
      return of(this.cachedPostsWithId.get(id)) as Observable<Post>
    } else {
      return this.commonApiService.getPostDetail(id).pipe(
        tap((postDetail) => this.cachedPostsWithId.set(id, postDetail)),
        catchError(() => {
          return of(null)
        })
      )
    }
  }
}
