import {Component} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {isDevMode} from '@angular/core';
import DetectRTC from "detectrtc";
import {FirebaseService} from "../../../shared/services/firebase.service";
import {Game} from "../../../shared/interfaces/game";
import {GameAuthService} from "../../services/game-auth.service";
import {Title} from "@angular/platform-browser";

@Component({
  selector: 'app-game-authorization',
  templateUrl: './game-authorization.component.html'
})
export class GameAuthorizationComponent {
  game: Game
  team
  isDevMode = isDevMode()
  isCaptain: boolean
  queryParamIsCaptain
  secretVerified = false;
  playerName = null
  detectRTC = DetectRTC
  teamSecret

  redirectUrl: string
  queryParam

  constructor(public router: Router,
              firebaseService: FirebaseService,
              private activatedRoute: ActivatedRoute,
              public gameAuthService: GameAuthService,
              titleService: Title,
  ) {
    titleService.setTitle('DQuiz | Авторизация')
    // console.log(activatedRoute)
    activatedRoute.params.subscribe(params => (
      firebaseService.getGame(params.gameId).subscribe((game: Game) => {
        titleService.setTitle('DQuiz | ' + game.name + ' | Авторизация')
        this.game = game
        if (!game) { router.navigate(['/not-found']) }
        this.team = this.game.teams.filter(team => team.id == params.teamId)[0]
        if (!this.team) { this.router.navigate(['/not-found']) }

        this.activatedRoute.queryParams.subscribe(queryParam => {
          this.queryParam = queryParam

          this.teamSecret = this.team.secret


          let previousAuth = this.gameAuthService.getAuth()
          console.log(previousAuth)
          if (+queryParam.teamSecret == this.teamSecret) {
            this.secretVerified = true
          }
          if (this.gameAuthService.isRedirectUrlAnswerForm() && +queryParam.teamSecret == this.teamSecret) {
            this.gameAuthService.logIn({
              name: null,
              isCaptain: false,
              secretVerified: true,
              secret: this.queryParam.teamSecret,
              game: {id: this.game.id, name: this.game.name},
              team: {id: this.team.id, name: this.team.name},
              authType: this.gameAuthService.isRedirectUrlAnswerForm() ? 'answer-form' : 'game-layout'
            })
            return
          }

          if (!this.gameAuthService.isRedirectUrlAnswerForm() && queryParam.isCaptain && queryParam.isCaptain === 'true') {
            this.queryParamIsCaptain = true
            this.isCaptain = true
          } else {
            this.queryParamIsCaptain = false
            this.isCaptain = false
          }


          if (!this.gameAuthService.isRedirectUrlAnswerForm() && previousAuth && previousAuth.game.id == game.id && previousAuth.team.id == this.team.id && +previousAuth.secret == this.teamSecret) {
            this.secretVerified = true
            this.teamSecret = previousAuth.secret
            this.playerName = previousAuth.name == 'null' ? null : previousAuth.name
            this.isCaptain = previousAuth.isCaptain
          } else {
            gameAuthService.logOut()
          }

        })
      })
    ))
  }

  secretInputValidation() {
    // @ts-ignore
    document.getElementById('secretInput').value = document.getElementById('secretInput').value
    document.getElementById('verifyButton').classList.remove('btn-outline-danger')
    document.getElementById('secretInput').classList.remove('is-invalid')
    document.getElementById('secretInputContainer').style.width = '15em'


    // @ts-ignore
    if (!+document.getElementById('secretInput').value[document.getElementById('secretInput').value.length - 1] && (document.getElementById('secretInput').value[document.getElementById('secretInput').value.length - 1] != '0' || (document.getElementById('secretInput').value[document.getElementById('secretInput').value.length - 1] != 0))) {
      // @ts-ignore
      document.getElementById('secretInput').value = document.getElementById('secretInput').value.substring(0, document.getElementById('secretInput').value.length - 1)
    }
  }

  secretVerification() {
    // @ts-ignore
    if (document.getElementById('secretInput').value.length < 6) {
      return
    }
    // @ts-ignore
    if (document.getElementById('secretInput').value == this.teamSecret) {
      this.secretVerified = true
      if (this.gameAuthService.isRedirectUrlAnswerForm() && +this.queryParam.teamSecret == this.teamSecret) {
        this.gameAuthService.logIn({
          name: null,
          isCaptain: false,
          secretVerified: true,
          secret: this.secretVerified,
          game: {id: this.game.id, name: this.game.name},
          team: {id: this.team.id, name: this.team.name},
          authType: this.gameAuthService.isRedirectUrlAnswerForm() ? 'answer-form' : 'game-layout'

        })
        return
      }
    } else {
      document.getElementById('secretInput').classList.add('is-invalid')
      document.getElementById('secretInputContainer').style.width = '18em'
      document.getElementById('verifyButton').classList.add('btn-outline-danger')
      document.getElementById('secretInput').focus()
      // @ts-ignore
      document.getElementById('secretInput').value = ''
    }
  }

  authorisation() {
    this.gameAuthService.logIn({
      name: this.playerName,
      isCaptain: this.isCaptain,
      secretVerified: this.secretVerified,
      secret: this.teamSecret,
      game: {id: this.game.id, name: this.game.name},
      team: {id: this.team.id, name: this.team.name},
      authType: this.gameAuthService.isRedirectUrlAnswerForm() ? 'answer-form' : 'game-layout'
    })

  }
}

