import {AfterViewInit, Component, OnInit} from '@angular/core';
import {ActivatedRoute, Params, Router} from "@angular/router";
import {FirebaseService} from "../../../shared/services/firebase.service";
import {FormGroup} from "@angular/forms";
import {Game} from "../../../shared/interfaces/game";

@Component({
  selector: 'app-teams-list',
  templateUrl: './teams-list.component.html'
})
export class TeamsListComponent implements AfterViewInit {


  constructor(
    private activatedRoute: ActivatedRoute,
    public router: Router,
    public firebaseService: FirebaseService) {
  }
  game: Game;



  ngAfterViewInit(): void {
    this.activatedRoute.params.subscribe((params: Params) => {
      this.firebaseService.getGame(params.gameId).subscribe(game => {
        if (game) {
          this.game = game;

          window.setInterval(() => {
            let pos = window.pageYOffset;
            if (pos > 0) { window.scrollTo(0, pos - 3);}
            if (pos == 0) { window.scrollTo(0, document.getElementById('scrollContainer').scrollHeight);}
          }, 10);
        }
        else { this.router.navigate(['/admin']) }
      })
    })
  }

}
