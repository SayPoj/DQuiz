import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterModule, Routes} from "@angular/router";
import {IsDevGuard} from "../shared/guard/is-dev.guard";
import { FirebaseArrayUpdateComponent } from './firebase-array-update/firebase-array-update.component';

const routes: Routes = [
  {path: '', component: FirebaseArrayUpdateComponent, canActivate: [IsDevGuard]},
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),

  ],
  exports: [RouterModule],
  declarations: [FirebaseArrayUpdateComponent],
  providers: [IsDevGuard]
})
export class TestModule { }
