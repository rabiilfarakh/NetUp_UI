import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsersRoutingModule } from './users-routing.module';
import { UsersComponent } from './users.component';
import { RegisterComponent } from './commponents/register/register.component';
import {FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoginComponent } from './commponents/login/login.component';
import { DashboardComponent } from './commponents/dashboard/dashboard.component';
import { ProfilComponent } from './commponents/profil/profil.component';


@NgModule({
  declarations: [
    UsersComponent,
    RegisterComponent,
    LoginComponent,
    DashboardComponent,
    ProfilComponent
  ],
  imports: [
    CommonModule,
    FormsModule,   
    UsersRoutingModule,
    ReactiveFormsModule,
    
  ]
})
export class UsersModule { }
