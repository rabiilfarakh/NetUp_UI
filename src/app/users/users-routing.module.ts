import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RegisterComponent } from './commponents/register/register.component';
import {LoginComponent} from './commponents/login/login.component';
import { DashboardComponent } from './commponents/dashboard/dashboard.component';

import { AuthGuard } from './auth/guard/auth.guard';
import { roleGuard } from '../guards/role.guard';
import { ProfileComponent } from './commponents/profile/profile.component';

const routes: Routes = [
  { path: 'register', component: RegisterComponent },
  { path: 'login', component: LoginComponent },
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard, roleGuard]},
  { path: 'profile', component: ProfileComponent, canActivate: [AuthGuard]},


];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UsersRoutingModule {}
