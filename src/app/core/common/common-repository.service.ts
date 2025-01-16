import { Injectable, inject } from '@angular/core';
import { CommonApiService } from './common-api.service';
import { ListParams } from '../models/list-params.model';

@Injectable({
  providedIn: 'root'
})
export class CommonRepositoryService {

  #commonApiService = inject(CommonApiService)
  
  constructor() { }

  getPhotos(params: ListParams) {
    return this.#commonApiService.getPhotos(params)
  }
  getPosts(params: ListParams) {
    return this.#commonApiService.getPosts(params)
  }
  getAlbums(params: ListParams) {
    return this.#commonApiService.getAlbums(params)
  }
}
