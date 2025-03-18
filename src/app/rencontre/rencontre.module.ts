import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RencontreRoutingModule } from './rencontre-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { SharedModule } from "../shared/shared.module";
import { RencontreComponent } from './rencontre.component';


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
