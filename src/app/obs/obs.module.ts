import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule, Routes} from '@angular/router';
import {AdminAuthGuard} from "../admin/services/admin-auth.guard";
import {AdminAuthService} from "../admin/services/admin-auth.service";
import {GameWinnersComponent} from "./pages/game-winners/game-winners.component";
import {TeamsListComponent} from "./pages/teams-list/teams-list.component";





const routes: Routes = [
  {path: 'game-winners/:gameId', component: GameWinnersComponent, canActivate: [AdminAuthGuard]},
  {path: 'teams-list/:gameId', component: TeamsListComponent, canActivate: [AdminAuthGuard]},
];


@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),

  ],
  exports: [RouterModule],
  declarations: [
    GameWinnersComponent,
    TeamsListComponent
  ],
  providers: [AdminAuthService, AdminAuthGuard]
})

export class ObsModule {}
