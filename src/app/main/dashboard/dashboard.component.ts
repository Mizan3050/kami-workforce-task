import { Component, OnInit, inject } from '@angular/core';
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
  photosCount: number = 0;
  commonRepositoryService = inject(CommonRepositoryService);

  ngOnInit(): void {
    this.getPhotos();
  }

  getPhotos() {
    const params = new ListParams(null, 0, 20);
    this.photos$ = this.commonRepositoryService.getPhotos(params).pipe(
      tap((photos) => {
        this.photosCount = photos.length;
      })
    )
  }
}
