import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {IsDevGuard} from "./shared/guard/is-dev.guard";



const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./main/main.module').then(m => m.MainModule)
  },
  {
    path: 'admin',
    loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule)
  },
  {
    path: 'game',
    loadChildren: () => import('./game/game.module').then(m => m.GameModule)
  },
  {
    path: 'test',
    loadChildren: () => import('./test/test.module').then(m => m.TestModule),
    canLoad: [IsDevGuard]
  },
  {
    path: 'obs',
    loadChildren: () => import('./obs/obs.module').then(m => m.ObsModule)
  },
  {path: '**', redirectTo: '/not-found'}

];

@NgModule({
  imports: [RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
