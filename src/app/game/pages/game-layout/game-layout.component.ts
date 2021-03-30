import {AfterViewInit, Component, ViewChild, ViewEncapsulation} from '@angular/core';
import {ActivatedRoute, Params, Router} from "@angular/router";
import {FirebaseService} from "../../../shared/services/firebase.service";
import {Game} from "../../../shared/interfaces/game";
import {JitsiComponent} from "../../../shared/components/jitsi/jitsi.component";
import {BroadcastingComponent} from "../../../shared/components/broadcasting/broadcasting.component";
import {ChatComponent} from "../../../shared/components/chat/chat.component";

import {AnswerFormComponent} from "../../components/answer-form/answer-form.component";
import {Title} from "@angular/platform-browser";
import {isDevMode} from '@angular/core';
import {GameAuthService} from "../../services/game-auth.service";

@Component({
  selector: 'app-game-layout',
  templateUrl: './game-layout.component.html',
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
export class GameLayoutComponent implements AfterViewInit {
  game: Game;
  team


  player;
  chat
  localShowChat = true
  deviceWidth = (window.innerWidth > 0) ? window.innerWidth : screen.width


  chatAndFormSwitcher = 'chat'
  Object = Object

  chatComponent
  broadcastingComponent
  answerFormComponent
  window: any;
  userMediaPermissions = false
  showBadUserMediaPermissions = false


  @ViewChild(JitsiComponent) set startJitsi(jitsiComponent: JitsiComponent) {

    if (!isDevMode() && jitsiComponent && !jitsiComponent.isMeetingOn && !jitsiComponent.isLoading) {

      jitsiComponent.init(
        `${this.player.game.id}/${this.player.team.id}`,
        this.player.name,
        this.player.team.name,
      )
    }
  }

  @ViewChild(BroadcastingComponent) set startBroadcasting(broadcastingComponent: BroadcastingComponent) {
    if (broadcastingComponent && !broadcastingComponent.isOnline) {
      broadcastingComponent.viewer();
      this.broadcastingComponent = broadcastingComponent
    }
  }

  @ViewChild(ChatComponent) set startChat(chatComponent: ChatComponent) {
    if (chatComponent && !chatComponent.chatLoading && !chatComponent.isOpen) {
      chatComponent.init();
      this.chatComponent = chatComponent
    }
  }

  @ViewChild(AnswerFormComponent) set setAnswerForm(answerFormComponent: AnswerFormComponent) {
    if (answerFormComponent) {
      this.answerFormComponent = answerFormComponent
    }
  }


  constructor(
    private activatedRoute: ActivatedRoute,
    public router: Router,
    public firebaseService: FirebaseService,
    public gameAuthService: GameAuthService,
    private title: Title
  ) {
    // @ts-ignore
    navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;
    this.player = this.gameAuthService.getAuth()
  }

  saveAnswers(){
    // console.log(this.team)
    this.firebaseService.updateGame({teams: this.game.teams}, this.game.id)
  }

  ngAfterViewInit(): void {

    this.activatedRoute.params.subscribe((params: Params) => {
      this.firebaseService.getGame(params.gameId).subscribe((game: Game) => {
        if (!game) {
          this.router.navigate(['/not-found'])
        }

        this.title.setTitle('DQuiz | ' + game.name)
        navigator.mediaDevices.getUserMedia({video: true, audio: true}).then(
          (res) => {
            this.userMediaPermissions = true;
            res.getTracks().forEach((track) => {
              track.stop();
            });
          },
          () => {
            this.userMediaPermissions = false;
            this.showBadUserMediaPermissions = true
          });

        this.game = game;
        this.team = this.game.teams.filter(team => team.id == params.teamId)[0]
        if (!this.team) {
          this.router.navigate(['/not-found'])
        }

        if (this.player) {
          this.gameStatusHandler()
        } else {
          if (this.player.secret != this.team.secret) {
            this.gameAuthService.logOut()
            this.router.navigate([`/game/${this.game.id}/${this.team.id}/auth`])
          }
        }

      })
    })
  }

  gameStatusHandler() {
    // if (this.player.isCaptain && this.game.state != 4 && this.game.state != 5)

    if (this.game.state != 0 && this.game.state != 4 && this.game.state != 5) {
      if (!this.game.showChat && this.player.isCaptain) {
        this.chatAndFormSwitcher = 'answerForm'
      }


    }
    if (this.game.state == 2) {
      if (this.broadcastingComponent) {
        this.broadcastingComponent.video.muted = true
      }
    }
    if (this.game.state == 4) {

      if (this.game.showChat) {
        this.chatAndFormSwitcher = 'chat'
      }

    }
  }

}
