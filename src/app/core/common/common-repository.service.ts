import { Injectable, inject } from '@angular/core';
import { ListParams } from '../models/list-params.model';
import { CommonApiService } from './common-api.service';
import { delay, map, of, tap } from 'rxjs';
import { Photo } from '../../main/photos/interface/photos.interface';
import { Post } from '../../main/posts/interface/post.interface';

@Injectable({
  providedIn: 'root'
})
export class CommonRepositoryService {

  #commonApiService = inject(CommonApiService)
  #cachedPhotos = new Set<Photo>();
  #cachedAlbums = new Set<any>();
  #cachedPosts = new Set<Post>();

  constructor() { }

  getPhotos(params: ListParams) {
    if (this.#cachedPhotos.size) {
      return of(Array.from(this.#cachedPhotos))
    } else {
      return this.#commonApiService.getPhotos(params).pipe(
        delay(1000),
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
        delay(1000),
        tap((posts) => {
          this.#cachedPosts = new Set(posts);
        })
      )
    }
  }
  getAlbums(params: ListParams) {
    if (this.#cachedAlbums.size) {
      return of(Array.from(this.#cachedPhotos))
    } else {
      return this.#commonApiService.getAlbums(params).pipe(
        delay(1000),
        tap((albums) => {
          this.#cachedAlbums = new Set(albums);
        })
      )
    }
  }
  getPhotoDetail(id: string) {
    return this.#commonApiService.getPhotoDetail(id).pipe(
      delay(1000)
    )
  }
  getPostDetail(id: string) {
    return this.#commonApiService.getPostDetail(id).pipe(
      delay(1000)
    )
  }
}
