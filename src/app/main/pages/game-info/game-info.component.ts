import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Params, Router} from "@angular/router";
import {FirebaseService} from "../../../shared/services/firebase.service";
import {Title} from "@angular/platform-browser";
import {Game} from "../../../shared/interfaces/game";

@Component({
  selector: 'app-game-info',
  templateUrl: './game-info.component.html',
})
export class GameInfoComponent implements OnInit {
  game: Game;

  constructor(
    private activatedRoute: ActivatedRoute,
    public router: Router,
    public firebaseService: FirebaseService,
    private titleService: Title) {
  }
  newDate(date:Date){
    date = new Date(date)
    return date.setMinutes(date.getMinutes() + 30)
  }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params: Params) => {
        this.firebaseService.getGame(params.gameId).subscribe(game => {
          if (game) {
            this.game = game;
            this.titleService.setTitle('DQuiz | '+this.game.name)
            setTimeout(()=>{ document.getElementById('fullDescription').innerHTML = this.game.fullDescription },10)
          } else {
            this.router.navigate([''])
          }
        })
      }
    )
  }
}
