import {LOCALE_ID, NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule, Routes} from '@angular/router';
import {HomePageComponent} from './components/main-home/home-page.component';
import {GameInfoComponent} from './pages/game-info/game-info.component';

import {GameRegistrationComponent} from './pages/game-registration/game-registration.component';
import {registerLocaleData} from '@angular/common';

import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatTabsModule} from "@angular/material/tabs";
import {MatStepperModule} from "@angular/material/stepper";
import {ClipboardModule} from 'ngx-clipboard';
import {MatDialogModule} from '@angular/material/dialog';
import {LoadingFireComponent} from "../shared/components/loading-fire/loading-fire.component";
import {SharedComponentsModule} from "../shared/components/shared-components.module";
import {MatAutocompleteModule} from "@angular/material/autocomplete";
// import {MatInputModule} from "@angular/material/input";
import {EquipmentCheckComponent} from './components/equipment-check/equipment-check.component';
import {GameRegistrationInfoComponent} from './pages/game-registration-info/game-registration-info.component';
import {TextMaskModule} from 'angular2-text-mask';
import {BroadcastingComponent} from "../shared/components/broadcasting/broadcasting.component";
// import {ModalShowSecretComponent} from "./pages/game-registration/modal-show-secret/modal-show-secret.component";
// import  {FrCarouselModule}  from  'fr-carousel';
import {MainLayoutComponent} from './pages/main-layout/main-layout.component';
import {NotFoundComponent} from './components/not-found/not-found.component';
import {MatChipsModule} from "@angular/material/chips";
// import {NgbCarouselModule} from "@ng-bootstrap/ng-bootstrap";


const routes: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      {path: '', component: HomePageComponent}, // Просмотр игры
      {path: 'equipment-check', component: EquipmentCheckComponent},
      {path: 'not-found', component: NotFoundComponent},
      // {path: 'team-rating', component: ''}, // Рейтинг команд
      // {path: 'team/:teamId', component: ''}, // Просмотр статистики команды
      // {path: 'schedule', component: ''}, // Расписание игр
      // {path: 'payment/:gameId', component: ''}, // Оплата игры
    ]
  },
  {path: 'game-info', redirectTo: '/', pathMatch: 'full'},
  {path: 'game-info/:gameId', component: GameInfoComponent},
  {path: 'game-registration', redirectTo: '/not-found', pathMatch: 'full'},
  {path: 'game-registration/:gameId', component: GameRegistrationComponent},
  {
    path: 'game-registration/info' || 'game-registration/info/:gameId/' || 'game-registration/info/:gameId/:teamId',
    redirectTo: '/not-found',
    pathMatch: 'full'
  },
  {path: 'game-registration/info/:gameId/:teamId/:secret', component: GameRegistrationInfoComponent},

];


@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    ReactiveFormsModule,
    MatTabsModule,
    MatStepperModule,
    ClipboardModule,
    MatDialogModule,
    SharedComponentsModule,
    TextMaskModule,
    MatAutocompleteModule,
    // MatInputModule,

    // FrCarouselModule,
    FormsModule,
    MatChipsModule,
    // NgbCarouselModule
  ],
  exports: [RouterModule],
  declarations: [
    GameRegistrationInfoComponent,
    HomePageComponent,
    GameInfoComponent,
    GameRegistrationComponent,
    EquipmentCheckComponent,
    // ModalShowSecretComponent,
    MainLayoutComponent,
    NotFoundComponent
  ],
})

export class MainModule {
}
