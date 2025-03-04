import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RegisterComponent } from './commponents/register/register.component';
import {LoginComponent} from './commponents/login/login.component';
import { DashboardComponent } from './commponents/dashboard/dashboard.component';
import { ProfilComponent } from './commponents/profil/profil.component';
import { AuthGuard } from './auth/guard/auth.guard';
import { roleGuard } from '../guards/role.guard';

const routes: Routes = [
  { path: 'register', component: RegisterComponent },
  { path: 'login', component: LoginComponent },
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard, roleGuard]},
  { path: 'user/profil', component: ProfilComponent, canActivate: [AuthGuard]},

  { path: '**', redirectTo: 'login' } 

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UsersRoutingModule {}
