import { Routes } from '@angular/router';
import { PhotosComponent } from './photos.component';
import { PhotoDetailComponent } from './components/photo-detail/photo-detail.component';

export const routes: Routes = [
    {
        path: '',
        component: PhotosComponent
    },
    {
        path: ':id',
        component: PhotoDetailComponent
    }
]