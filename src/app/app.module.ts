import { NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration, withEventReplay } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { AuthInterceptor } from './users/auth/interceptor/auth.interceptor'; 
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { CommunityModule } from './community/community.module';
import { ArticleModule } from './article/article.module';
import { UsersModule } from './users/users.module';
import { CommentModule } from './comment/comment.module';




@NgModule({
  declarations: [
    AppComponent,
    
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    StoreModule.forRoot({}, {}),
    EffectsModule.forRoot([]),
    RouterModule,
    BrowserAnimationsModule,
    CommunityModule,
    ArticleModule,
    UsersModule,
    CommentModule,

    ToastrModule.forRoot({ 
      timeOut: 1500, 
      positionClass: 'toast-top-right',
      preventDuplicates: true, 
      progressBar: true,
      closeButton: true, 
    }),
  ],
  providers: [
    provideClientHydration(withEventReplay()),
    provideHttpClient(
      withFetch(),
      withInterceptors([AuthInterceptor]) 
    )
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
