import {NgModule} from '@angular/core';
import {CommonModule} from "@angular/common";
import {RouterModule, Routes} from "@angular/router";
import {AdminLayoutComponent} from "./pages/admin-layout/admin-layout.component";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatStepperModule} from "@angular/material/stepper";
import {GameHoldingComponent} from './pages/game-holding/game-holding.component';
import {SharedComponentsModule} from "../shared/components/shared-components.module";
// import {MatRadioModule} from "@angular/material/radio";

import {MatTabsModule} from "@angular/material/tabs";
import {NgbModalModule, NgbModule, NgbTooltipModule} from "@ng-bootstrap/ng-bootstrap";
// import {MatCheckboxModule} from "@angular/material/checkbox";
import {AdminAuthorizationComponent} from './pages/admin-authorization/admin-authorization.component';
import {AdminAuthService} from "./services/admin-auth.service";
import {AdminAuthGuard} from "./services/admin-auth.guard";
import {AdminHomeComponent} from './components/admin-home/admin-home.component';
import {AngularEditorModule} from '@kolkov/angular-editor';
import { GameScheduleComponent } from './components/game-schedule/game-schedule.component';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
// import {MatIconModule} from "@angular/material/icon";
// import {MatTableModule} from "@angular/material/table";
// import {MatSortModule} from "@angular/material/sort";
// import {MatButtonModule} from "@angular/material/button";
import { GameEditingComponent } from './components/game-editing/game-editing.component';
import {MatChipsModule} from "@angular/material/chips";
// import {MatFormFieldModule} from "@angular/material/form-field";




const routes: Routes = [
  {
    path: '',
    component: AdminLayoutComponent, // страничка админки (создание нового администратора, календарь мероприятий, панель навигации администратора)
    children: [
      {path: '', component: AdminHomeComponent},
      {path: 'game-schedule', component: GameScheduleComponent},
      {path: 'game-editing/:gameId', component: GameEditingComponent},
    ],
    canActivate: [AdminAuthGuard]
  },

  {path: 'auth', component: AdminAuthorizationComponent},
  {path: 'game-holding/:gameId', component: GameHoldingComponent, canActivate: [AdminAuthGuard]},
];


@NgModule({
  declarations: [
    AdminLayoutComponent,

    GameHoldingComponent,
    AdminAuthorizationComponent,
    AdminHomeComponent,
    GameScheduleComponent,

    GameEditingComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FormsModule,
    ReactiveFormsModule,
    MatStepperModule,
    SharedComponentsModule,
    // MatRadioModule,

    MatTabsModule,
    NgbModule,
    // MatCheckboxModule,
    AngularEditorModule,


    NgbModalModule,
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory,
    }),
    NgbTooltipModule,
    // MatIconModule,
    // MatTableModule,
    // MatSortModule,
    // MatButtonModule,
    MatChipsModule,
    // MatFormFieldModule,
  ],
  exports: [RouterModule],
  providers: [AdminAuthService, AdminAuthGuard]
})

export class AdminModule {
}
