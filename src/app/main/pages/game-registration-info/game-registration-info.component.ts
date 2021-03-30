import {AfterViewInit, Component} from '@angular/core';
import {ActivatedRoute, Params, Router} from "@angular/router";
import {FirebaseService} from "../../../shared/services/firebase.service";
import {Title} from "@angular/platform-browser";
import {Game} from "../../../shared/interfaces/game";
import {DatePipe} from "@angular/common";

@Component({
  selector: 'app-game-registration-info',
  templateUrl: './game-registration-info.component.html',
  styles: [`
    .scrollDownButton {
      -webkit-animation: sdb05 1.5s infinite;
      animation: sdb05 1.5s infinite;
      box-sizing: border-box;
    }

    @keyframes sdb05 {
      0% {
        transform: translate(0, -5px);
        opacity: 0;
      }
      50% {
        opacity: 1;
      }
      100% {
        transform: translate(0, 5px);
        opacity: 0;
      }
    }
  `]
})
export class GameRegistrationInfoComponent implements AfterViewInit {

  game
  team

  // http://localhost:4200/game-registration/info/svGXqRlbXIc03MIyj6fi/rnkuzv5wx/134188

  constructor(
    private activatedRoute: ActivatedRoute,
    public router: Router,
    public firebaseService: FirebaseService,
    private titleService: Title,
    public datePipe: DatePipe
  ) {

  }

  newDate(date: Date) {
    date = new Date(date)
    return date.setMinutes(date.getMinutes() + 30)
  }



  ngAfterViewInit(): void {
    this.activatedRoute.params.subscribe((params: Params) => {

      this.firebaseService.getGame(params.gameId).subscribe((game: Game) => {
        if (!game) { this.router.navigate(['/not-found']) }
        this.game = game;

        this.team = this.game.teams.filter(team => team.id == params.teamId)[0]
        if (!this.team) { this.router.navigate(['/not-found']) }
        this.titleService.setTitle('DQuiz | ' + this.game.name + ' | Информация о регистрации')
        if (this.team.secret != params.secret) {this.router.navigate(['/not-found'])}
        setTimeout(() => {
          document.getElementById('fullDescription').innerHTML = this.game.fullDescription
        }, 100)
      })
    })
  }

}
