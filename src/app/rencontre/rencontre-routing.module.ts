import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RencontreModule } from './rencontre.module';
import { RencontreComponent } from './rencontre.component';
import { AuthGuard } from '../guards/auth.guard';

const routes: Routes = [
  { path: '', component: RencontreComponent, canActivate: [AuthGuard] },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RencontreRoutingModule { }
