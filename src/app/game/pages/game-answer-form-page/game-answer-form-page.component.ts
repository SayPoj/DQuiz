import {AfterViewInit, Component, ViewChild, ViewEncapsulation} from '@angular/core';
import {ActivatedRoute, Params, Router} from "@angular/router";
import {FirebaseService} from "../../../shared/services/firebase.service";
import {Game} from "../../../shared/interfaces/game";
import {AnswerFormComponent} from "../../components/answer-form/answer-form.component";
import {Title} from "@angular/platform-browser";
import {GameAuthService} from "../../services/game-auth.service";

@Component({
  selector: 'app-game-answer-form-page',
  templateUrl: './game-answer-form-page.component.html',
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
export class GameAnswerFormPageComponent implements AfterViewInit {
  game: Game;
  team
  player
  answerFormComponent
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
    private title: Title) {
    this.player = this.gameAuthService.getAuth()
  }

  saveAnswers() {
    this.firebaseService.updateGame({teams: this.game.teams}, this.game.id)
  }


  ngAfterViewInit(): void {
    this.activatedRoute.params.subscribe((params: Params) => {
      this.firebaseService.getGame(params.gameId).subscribe((game: Game) => {


        // console.log(JSON.stringify(game)==JSON.stringify(this.game))
        // if(JSON.stringify(game)==JSON.stringify(this.game)){return}
        if (!game) {
          this.router.navigate(['/not-found'])
        }

        this.game = game;
        this.title.setTitle('DQuiz | ' + game.name + ' |Форма ответов ')
        this.team = this.game.teams.filter(team => team.id == params.teamId)[0]
        if (!this.team) {
          this.router.navigate(['/not-found'])
        }

        if (!this.player || this.player.secret != this.team.secret) {
          this.gameAuthService.logOut()
          this.router.navigate([`/game/${this.game.id}/${this.team.id}/auth`])
        }
      })
    })
  }
}
