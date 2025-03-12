import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ArticleRoutingModule } from './article-routing.module';

import { ArticleDetailComponent } from './components/article-detail/article-detail.component';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HomeComponent } from './components/home/home.component';
import { SharedModule } from '../shared/shared.module';
import { ArticleComponent } from './article.component';


@NgModule({
  declarations: [
    HomeComponent,
    ArticleComponent,
    ArticleDetailComponent
  ],
  imports: [
    CommonModule,
    ArticleRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule
  ],
  exports: [
    HomeComponent,

  ],
})
export class ArticleModule { }
