import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { ArticleDetailComponent } from './components/article-detail/article-detail.component';
import { AuthGuard } from '../guards/auth.guard';
import { ArticleComponent } from './article.component';
import { CreateArticleComponent } from './components/create-article/create-article.component';

const routes: Routes = [
    { path: '', component: ArticleComponent, canActivate: [AuthGuard] },
    { path: 'home', component: HomeComponent, canActivate: [AuthGuard] },
    { path: 'articles/:id', component: ArticleDetailComponent, canActivate: [AuthGuard] },
    { path: 'create_article', component: CreateArticleComponent, canActivate: [AuthGuard] },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ArticleRoutingModule { }
