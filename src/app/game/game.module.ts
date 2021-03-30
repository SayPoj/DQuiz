import {LOCALE_ID, NgModule} from "@angular/core";
import {CommonModule, registerLocaleData} from "@angular/common";
import {RouterModule, Routes} from "@angular/router";
import {SharedComponentsModule} from "../shared/components/shared-components.module";
import { GameLayoutComponent } from './pages/game-layout/game-layout.component';
import {JitsiComponent} from "../shared/components/jitsi/jitsi.component";

import {ClipboardModule} from "ngx-clipboard";
// import {MatDialogModule} from "@angular/material/dialog";
import {NgbTooltipModule} from "@ng-bootstrap/ng-bootstrap";
import localeRu from "@angular/common/locales/ru";
import {MatTabsModule} from "@angular/material/tabs";
import { GameAuthorizationComponent } from './pages/game-authorization/game-authorization.component';

import { AnswerFormComponent } from './components/answer-form/answer-form.component';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {GameAuthGuard} from "./services/game-auth.guard";
import {GameAuthService} from "./services/game-auth.service";
import { GameAnswerFormPageComponent } from './pages/game-answer-form-page/game-answer-form-page.component';
import { GameBroadcastPageComponent } from './pages/game-broadcast-page/game-broadcast-page.component';



registerLocaleData(localeRu, 'ru');
const routes: Routes = [


  {path:':gameId/live-stream', component: GameBroadcastPageComponent, pathMatch: 'full'},
  {path:':gameId/:teamId', component: GameLayoutComponent, canActivate: [GameAuthGuard]},
  {path:':gameId/:teamId/auth', component: GameAuthorizationComponent},
  {path:':gameId/:teamId/answer-form', component: GameAnswerFormPageComponent, canActivate: [GameAuthGuard]},
  {path:':gameId', redirectTo: '/game-info/:gameId', pathMatch: 'full'},
  {path: '**', redirectTo: '/not-found'}
];


@NgModule({
  imports: [
    CommonModule,
    SharedComponentsModule,
    RouterModule.forChild(routes),
    ClipboardModule,
    // MatDialogModule,
    NgbTooltipModule,
    MatTabsModule,
    ReactiveFormsModule,
    FormsModule
  ],
  exports: [RouterModule],
  declarations: [
    GameLayoutComponent,
    GameAuthorizationComponent,
    AnswerFormComponent,
    GameAnswerFormPageComponent,
    GameBroadcastPageComponent],
  providers: [
    GameAuthGuard,
    GameAuthService,
    { provide: LOCALE_ID, useValue: 'ru' }
  ]
})

export class GameModule {}
