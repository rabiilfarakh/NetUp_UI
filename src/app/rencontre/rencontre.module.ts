import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RencontreRoutingModule } from './rencontre-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RencontreComponent } from './rencontre.component';
import { SharedModule } from "../shared/shared.module";


@NgModule({
  declarations: [
    RencontreComponent
    ],
  imports: [
    CommonModule,
    RencontreRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule
]
})
export class RencontreModule { }
