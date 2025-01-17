import { Injectable, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, of, tap } from 'rxjs';
import { Photo } from '../../main/photos/interface/photos.interface';
import { Post } from '../../main/posts/interface/post.interface';
import { ListParams } from '../models/list-params.model';
import { CommonApiService } from './common-api.service';
import { Album } from '../../main/album/interface/album.interface';

@Injectable({
  providedIn: 'root'
})
export class CommonRepositoryService {

  #commonApiService = inject(CommonApiService)
  #cachedPhotos = new Set<Photo>();
  #cachedAlbums = new Set<Album>();
  #cachedPosts = new Set<Post>();
  #cachedPhotosWithId = new Map<string, Photo>();
  #cachedPostsWithId = new Map<string, Post>();
  
  getPhotos(params: ListParams) {
    if (this.#cachedPhotos.size) {
      return of(Array.from(this.#cachedPhotos))
    } else {
      return this.#commonApiService.getPhotos(params).pipe(
        tap((photos) => {
          this.#cachedPhotos = new Set(photos);
        })
      )
    }
  }

  getPosts(params: ListParams) {
    if (this.#cachedPosts.size) {
      return of(Array.from(this.#cachedPosts))
    } else {
      return this.#commonApiService.getPosts(params).pipe(
        tap((posts) => {
          this.#cachedPosts = new Set(posts);
        })
      )
    }
  }

  postsRefresh() {
    this.#cachedPosts.clear();
  }
  albumsRefresh() {
    this.#cachedAlbums.clear();
  }
  photosRefresh() {
    this.#cachedPhotos.clear();
  }

  getAlbums(params: ListParams) {
    if (this.#cachedAlbums.size) {
      return of(Array.from(this.#cachedAlbums))
    } else {
      return this.#commonApiService.getAlbums(params).pipe(
        tap((albums) => {
          this.#cachedAlbums = new Set(albums);
        })
      )
    }
  }

  getPhotoDetail(id: string): Observable<Photo> {
    if (this.#cachedPhotosWithId.get(id)?.id) {
      return of(this.#cachedPhotosWithId.get(id)) as Observable<Photo>
    } else {
      return this.#commonApiService.getPhotoDetail(id).pipe(
        tap((photoDetail) => this.#cachedPhotosWithId.set(id, photoDetail))
      )
    }
  }

  getPostDetail(id: string) {
    if (this.#cachedPostsWithId.get(id)?.id) {
      return of(this.#cachedPostsWithId.get(id)) as Observable<Post>
    } else {
      return this.#commonApiService.getPostDetail(id).pipe(
        tap((postDetail) => this.#cachedPostsWithId.set(id, postDetail))
      )
    }
  }
}
