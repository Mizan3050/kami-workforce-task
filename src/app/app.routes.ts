import { Routes } from '@angular/router';

export const routes: Routes = [
    { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    {
        path: 'dashboard',
        loadChildren: () => import("./main/dashboard/dashboard.routes").then(m => m.routes)
    },
    {
        path: 'posts',
        loadChildren: () => import("./main/posts/posts.routes").then(m => m.routes)
    },
    {
        path: 'albums',
        loadChildren: () => import("./main/album/album.routes").then(m => m.routes)
    },
    {
        path: 'photos',
        loadChildren: () => import("./main/photos/photos.routes").then(m => m.routes)
    }
];
