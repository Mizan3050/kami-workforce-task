import { Routes } from '@angular/router';

export const routes: Routes = [
    { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    {
        path: 'dashboard',
        loadChildren: () => import("./main/dashboard/dashboard.routes").then(m => m.routes),
        title: 'Dashboard'
    },
    {
        path: 'posts',
        loadChildren: () => import("./main/posts/posts.routes").then(m => m.routes),
        title: 'Posts'
    },
    {
        path: 'albums',
        loadChildren: () => import("./main/album/album.routes").then(m => m.routes),
        title: 'Albums'
    },
    {
        path: 'photos',
        loadChildren: () => import("./main/photos/photos.routes").then(m => m.routes),
        title: 'Photos'
    },
    {
        path: 'user',
        loadComponent: () => import("./main/user-detail/user-detail.component").then(c => c.UserDetailComponent),
        title: 'User Detail'
    }
];
