import { AsyncPipe, NgIf } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { CommonRepositoryService } from '../../../../core/services/common-repository.service';
import { LoaderComponent } from "../../../../shared/components/loader/loader.component";
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
  postDetail$: Observable<Post | null> = this.#commonRepositoryService.getPostDetail(this.postId).pipe(
    tap(() => {
      this.postDetailLoading.set(true);
    })
  )
}
