import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UsersRoutingModule } from './users-routing.module';
import { UsersComponent } from './users.component';
import { EffectsModule } from '@ngrx/effects';
import { UserEffects } from './state/effect/user.effects';
import { UserReducer } from './state/reducer/user.reducer';
import { StoreModule } from '@ngrx/store';
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
    StoreModule.forFeature("user",UserReducer),
    EffectsModule.forFeature([UserEffects])
  ]
})
export class UsersModule { }
