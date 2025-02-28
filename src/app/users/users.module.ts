import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsersRoutingModule } from './users-routing.module';
import { UsersComponent } from './users.component';
import { RegisterComponent } from './commponents/register/register.component';
import { ReactiveFormsModule } from '@angular/forms';
import { LoginComponent } from './commponents/login/login.component';


@NgModule({
  declarations: [
    UsersComponent,
    RegisterComponent,
    LoginComponent
  ],
  imports: [
    CommonModule,
    UsersRoutingModule,
    ReactiveFormsModule,
  ]
})
export class UsersModule { }
