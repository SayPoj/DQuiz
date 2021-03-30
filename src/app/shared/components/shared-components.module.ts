import { NgModule } from '@angular/core';
import {CommonModule} from "@angular/common";
import {ReactiveFormsModule} from "@angular/forms";
import { BroadcastingComponent } from './broadcasting/broadcasting.component';
import { JitsiComponent } from './jitsi/jitsi.component';
import { LoadingFireComponent } from './loading-fire/loading-fire.component';
import { ChatComponent } from './chat/chat.component';
import {NgbModule} from "@ng-bootstrap/ng-bootstrap";

@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        NgbModule,
    ],
  declarations: [
    BroadcastingComponent,
    JitsiComponent,
    LoadingFireComponent,
    ChatComponent,
  ],
    exports: [
        BroadcastingComponent,
        JitsiComponent,
        LoadingFireComponent,
        ChatComponent,
    ]
})
export class SharedComponentsModule { }
