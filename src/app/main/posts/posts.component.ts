import { Component, inject, signal } from '@angular/core';
import { LoaderComponent } from "../../shared/components/loader/loader.component";
import { AsyncPipe, NgFor, NgIf } from '@angular/common';
import { CommonRepositoryService } from '../../core/common/common-repository.service';
import { ListParams } from '../../core/models/list-params.model';
import { tap } from 'rxjs';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-posts',
  imports: [LoaderComponent, NgIf, AsyncPipe, NgFor, RouterLink],
  templateUrl: './posts.component.html',
  styleUrl: './posts.component.scss'
})
export class PostsComponent {

  #commonRepositoryService = inject(CommonRepositoryService);
  params = new ListParams();
  postsLoading = signal(true);
  posts$ = this.#commonRepositoryService.getPosts(this.params).pipe(
    tap(() => {
      this.postsLoading.set(false)
    })
  )
}
