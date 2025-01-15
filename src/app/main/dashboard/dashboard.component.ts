import { Component, OnInit, WritableSignal, inject, signal } from '@angular/core';
import { DashboardSidebarComponent } from './components/dashboard-sidebar/dashboard-sidebar.component';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../environment/environment';
import { AsyncPipe, NgFor, NgIf } from '@angular/common';
import { CommonRepositoryService } from '../../core/common/common-repository.service';
import { Observable, tap } from 'rxjs';
import { ListParams } from '../../core/models/list-params.model';
import { Photo } from '../photos/interface/photos.interface';

@Component({
  selector: 'app-dashboard',
  imports: [DashboardSidebarComponent, AsyncPipe, NgIf, NgFor],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {

  photos$!: Observable<Photo[]>;
  photosCount: WritableSignal<number> = signal(0);

  posts$!: Observable<any[]>;
  postsCount: WritableSignal<number> = signal(0);

  commonRepositoryService = inject(CommonRepositoryService);

  summary_widgets = [
    {
      title: 'POSTS',
      count: this.postsCount,
      class: 'fas fa-comment-alt text-primary'
    },
    {
      title: 'ALBUMS',
      count: this.photosCount,
      class: 'fas fa-images text-success'
    },
    {
      title: 'PHOTOS',
      count: signal(12),
      class: 'fas fa-camera text-warning'
    }
  ]

  ngOnInit(): void {
    this.getPhotos();
    this.getPosts();
  }

  getPhotos() {
    const params = new ListParams(null, 0, 20);
    this.photos$ = this.commonRepositoryService.getPhotos(params).pipe(
      tap((photos) => {
        this.photosCount.set(photos.length);
      })
    )
  }

  getPosts() {
    const params = new ListParams(null, 0, 20);
    this.posts$ = this.commonRepositoryService.getPosts(params).pipe(
      tap((posts) => {
        this.postsCount.set(posts.length);
      })
    )
  }
}
