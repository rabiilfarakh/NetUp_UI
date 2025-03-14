import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', loadChildren: () => import('./users/users.module').then(m => m.UsersModule) }, 
  { path: 'access-denied', loadChildren: () => import('./access-denied/access-denied.module').then(m => m.AccessDeniedModule) }, 
  { path: 'articles', loadChildren: () => import('./article/article.module').then(m => m.ArticleModule) },
  { path: 'rencontres', loadChildren: () => import('./rencontre/rencontre.module').then(m => m.RencontreModule) },
  { path: 'communities', loadChildren: () => import('./community/community.module').then(m => m.CommunityModule) }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
