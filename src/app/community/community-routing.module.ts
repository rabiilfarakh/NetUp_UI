import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommunityComponent } from './community.component';
import { CommunityDetailComponent } from './components/community-detail/community-detail.component';
import { AuthGuard } from '../guards/auth.guard';

const routes: Routes = [
  { path: '', component: CommunityComponent, canActivate: [AuthGuard] },
  { path: 'communities/:id', component: CommunityDetailComponent,canActivate: [AuthGuard]  }, 
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CommunityRoutingModule { }