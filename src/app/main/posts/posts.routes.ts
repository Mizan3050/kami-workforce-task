import { Routes } from "@angular/router";
import { PostsComponent } from "./posts.component";
import { PostDetailComponent } from "./components/post-detail/post-detail.component";

export const routes: Routes = [
    {
        path: '',
        component: PostsComponent
    },
    {
        path: ':id',
        component: PostDetailComponent
    }
]