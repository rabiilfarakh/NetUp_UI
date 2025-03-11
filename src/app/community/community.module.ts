import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CommunityRoutingModule } from './community-routing.module';
import { SharedModule } from '../shared/shared.module';
import { CommunityComponent } from './community.component';
import { CommunityDetailComponent } from './components/community-detail/community-detail.component';




@NgModule({
  declarations: [
    CommunityComponent,
    CommunityDetailComponent
  ],
  imports: [
    CommonModule,
    CommunityRoutingModule,
    SharedModule
  ]
})
export class CommunityModule { }
