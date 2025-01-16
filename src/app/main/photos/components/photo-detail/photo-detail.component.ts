import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonRepositoryService } from '../../../../core/common/common-repository.service';
import { AsyncPipe, NgIf } from '@angular/common';
import { Observable, map, of, tap } from 'rxjs';
import { LoaderComponent } from '../../../../shared/components/loader/loader.component';
import { Photo } from '../../interface/photos.interface';

@Component({
  selector: 'app-photo-detail',
  imports: [
    AsyncPipe,
    NgIf,
    LoaderComponent
  ],
  templateUrl: './photo-detail.component.html',
  styleUrl: './photo-detail.component.scss'
})
export class PhotoDetailComponent {
  route = inject(ActivatedRoute);
  photoId = this.route.snapshot.paramMap.get('id') || '';

  #commonRepositoryService = inject(CommonRepositoryService);

  photoDetailLoading = signal(true);
  photoDetail$: Observable<Photo> = this.#commonRepositoryService.getPhotoDetail(this.photoId).pipe(
    tap(() => {
      this.photoDetailLoading.set(true);
    })
  )

}
