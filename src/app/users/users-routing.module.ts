import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RegisterComponent } from './commponents/register/register.component';
import {LoginComponent} from './commponents/login/login.component';
import { DashboardComponent } from './commponents/dashboard/dashboard.component';
import { ProfilComponent } from './commponents/profil/profil.component';

const routes: Routes = [
  { path: 'register', component: RegisterComponent },
  { path: 'login', component: LoginComponent },
  {path: 'dashboard', component: DashboardComponent},
  {path: 'user/profil', component: ProfilComponent},

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UsersRoutingModule { }
