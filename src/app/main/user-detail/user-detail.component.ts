import { AsyncPipe, NgFor, NgIf } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { ListParams } from '../../core/models/list-params.model';
import { CommonRepositoryService } from '../../core/services/common-repository.service';
import { LoaderComponent } from "../../shared/components/loader/loader.component";
import { Post } from '../posts/interface/post.interface';

@Component({
  selector: 'app-user-detail',
  imports: [NgIf, AsyncPipe, LoaderComponent, NgFor],
  templateUrl: './user-detail.component.html',
  styleUrl: './user-detail.component.scss'
})
export class UserDetailComponent implements OnInit {

  #commonRepositoryService = inject(CommonRepositoryService);
  #router = inject(Router);
  postsLoading = signal(false);
  posts$!: Observable<Array<Post>>

  ngOnInit(): void {
    this.getPosts();
  }

  getPosts() {
    const params: ListParams = new ListParams();
    this.postsLoading.set(true);
    this.posts$ = this.#commonRepositoryService.getPosts(params).pipe(
      tap(() => {
        this.postsLoading.set(false)
      })
    )
  }

  goToPostDetail(id: number) {
    this.#router.navigate(['posts', id])
  }
}
