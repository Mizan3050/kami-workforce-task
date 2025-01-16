import { Injectable, inject } from '@angular/core';
import { ListParams } from '../models/list-params.model';
import { CommonApiService } from './common-api.service';

@Injectable({
  providedIn: 'root'
})
export class CommonRepositoryService {

  #commonApiService = inject(CommonApiService)

  constructor() { }

  getPhotos(params: ListParams) {
    return this.#commonApiService.getPhotos(params).pipe(
      // delay(50000)
    )
  }
  getPosts(params: ListParams) {
    return this.#commonApiService.getPosts(params).pipe(
      // delay(50000)
    )
  }
  getAlbums(params: ListParams) {
    return this.#commonApiService.getAlbums(params).pipe(
      // delay(50000)
    )
  }
  getPhotoDetail(id:string) {
    return this.#commonApiService.getPhotoDetail(id).pipe(
      // delay(50000)
    )
  }
}
