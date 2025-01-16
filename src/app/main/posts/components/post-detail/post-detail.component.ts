import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { CommonRepositoryService } from '../../../../core/common/common-repository.service';
import { Photo } from '../../../photos/interface/photos.interface';
import { LoaderComponent } from "../../../../shared/components/loader/loader.component";
import { AsyncPipe, NgIf } from '@angular/common';
import { Post } from '../../interface/post.interface';

@Component({
  selector: 'app-post-detail',
  imports: [LoaderComponent, NgIf, AsyncPipe],
  templateUrl: './post-detail.component.html',
  styleUrl: './post-detail.component.scss'
})
export class PostDetailComponent {
  route = inject(ActivatedRoute);
  postId = this.route.snapshot.paramMap.get('id') || '';

  #commonRepositoryService = inject(CommonRepositoryService);

  postDetailLoading = signal(true);
  postDetail$: Observable<Post> = this.#commonRepositoryService.getPostDetail(this.postId).pipe(
    tap(() => {
      this.postDetailLoading.set(true);
    })
  )
}
