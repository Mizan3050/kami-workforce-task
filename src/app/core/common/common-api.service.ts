import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from '../../../environment/environment';
import { ListParams } from '../models/list-params.model';
import { Observable, map } from 'rxjs';
import { Photo } from '../../main/photos/interface/photos.interface';

@Injectable({
  providedIn: 'root'
})
export class CommonApiService {

  #http = inject(HttpClient)
  constructor() { }

  getPhotos(_params: ListParams): Observable<Array<Photo>> {
    return this.#http.get<Array<Photo>>(`${environment.apiUrl}/photos/`, {
      params: this.getListHttpParams(_params)
    }).pipe(
      map((photos) => photos.map((photo) => {
        return {
          ...photo,
          thumbnailUrl: this.photoThumbnailReplacer(),
          url: this.photoUrlReplacer()
        }
      })
      )
    )
  }

  private getListHttpParams(params: ListParams): HttpParams {
    const { _start = 0, _limit = 20, _sort = '' } = params || null;
    const httpParams: HttpParams = new HttpParams()
      .set('_start', _start)
      .set('_limit', _limit)
      .set('_sort', _sort)
    return httpParams
  }

  private photoThumbnailReplacer() {
    const randomColor = `${Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')}`;
    console.log(randomColor);
    
    return `https://placehold.co/120x140/${randomColor}/FFFFFF/png`
  }
  private photoUrlReplacer() {
    const randomColor = `${Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')}`;
    return `https://placehold.co/240x280/${randomColor}/FFFFFF/png`
  }

}
