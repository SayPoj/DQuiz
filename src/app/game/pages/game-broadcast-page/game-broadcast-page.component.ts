import {AfterViewInit, Component, ViewChild, ViewEncapsulation} from '@angular/core';
import {ActivatedRoute, Params, Router} from "@angular/router";
import {FirebaseService} from "../../../shared/services/firebase.service";
import {Game} from "../../../shared/interfaces/game";
import {BroadcastingComponent} from "../../../shared/components/broadcasting/broadcasting.component";
import {Title} from "@angular/platform-browser";


@Component({
  selector: 'app-game-broadcast-page',
  templateUrl: './game-broadcast-page.component.html',
  encapsulation: ViewEncapsulation.None,
  styles: [`
    .my-custom-class .tooltip-inner {
      background-color: #6c757d !important;
      width: 400px;
    }
    .my-custom-class .arrow::before {
      border-top-color: #6c757d !important;
    }
    #dropdown-menuToggleChatForm.dropdown-menu {
      width: 270px !important;
    }

  `]
})
export class GameBroadcastPageComponent implements AfterViewInit {
  game: Game;
  broadcastingComponent
  deviceWidth = (window.innerWidth > 0) ? window.innerWidth : screen.width
  @ViewChild(BroadcastingComponent) set startBroadcasting(broadcastingComponent: BroadcastingComponent){
    if ( broadcastingComponent && !broadcastingComponent.isOnline) { broadcastingComponent.viewer(); this.broadcastingComponent = broadcastingComponent}
  }





  constructor(
    private activatedRoute: ActivatedRoute,
    public router: Router,
    public firebaseService: FirebaseService,
    private title: Title
  ) { }


  ngAfterViewInit(): void {
    this.activatedRoute.params.subscribe((params: Params) => {
      this.firebaseService.getGame(params.gameId).subscribe((game:Game) => {

        if (!game) { this.router.navigate(['/not-found']) }
        this.title.setTitle('DQuiz | '+game.name)
        this.game = game

      })
    })
  }



}
