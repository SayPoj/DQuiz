import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {ActivatedRoute, Params, Router} from "@angular/router";
import {FirebaseService} from "../../../shared/services/firebase.service";
import {Game} from "../../../shared/interfaces/game";

@Component({
  selector: 'app-game-winners',
  templateUrl: './game-winners.component.html',
})
export class GameWinnersComponent{

  constructor(
    private activatedRoute: ActivatedRoute,
    public router: Router,
    public firebaseService: FirebaseService) {
  }
  game: Game;
  gameAnswersModel;
  totalPoints;
  Object = Object;
  gameTeamsSortedByPoints = []


  /*ngOnInit(): void {

    this.activatedRoute.params.subscribe((params: Params) => {
      this.firebaseService.getGame(params.gameId).subscribe(game => {
        // @ts-ignore
        this.firebaseService.getGameAnswers(game.answersDocId).subscribe(gameAnswersModel => {

          if (game) {
            this.game = game;
            this.totalPoints = 0

            for (let pointsPerQuestion in gameAnswersModel['points']) { this.totalPoints += (+gameAnswersModel['points'][pointsPerQuestion]) }

            this.gameTeamsSortedByPoints = []
            for (let gameTeamId in this.game.gameTeamsPoints){

              this.gameTeamsSortedByPoints.push({
                // teamId: gameTeamId,
                teamName: this.game.gameTeamsPoints[gameTeamId].teamName,
                points: this.game.gameTeamsPoints[gameTeamId].points
              })
            }
            this.gameTeamsSortedByPoints.sort(function(a, b) {
              if (a.points > b.points) {
                return -1;
              }
              if (a.points < b.points) {
                return 1;
              }
              return 0;
            });

            /!*-------------------------------


            // @ts-ignore
            this.gameTeams = teams.filter(gameTeam => this.game.teams.indexOf(gameTeam.id) != -1)
            this.gameTeamsPoints={}
            this.gameTeamsSortedByPoints = []



            for (let gameTeam of this.gameTeams) {

              if(this.game.answers.filter(gameTeamAnswers => gameTeamAnswers.teamId == gameTeam.id).length!=0){
                let gameTeamAnswers = this.game.answers.filter(gameTeamAnswers => gameTeamAnswers.teamId == gameTeam.id)

                let gameTeamPoints = {
                  teamId: gameTeam.id,
                  teamName: gameTeam.name,
                  // @ts-ignore
                  answers: gameTeamAnswers[0].answersModel,
                  points: 0
                }
                for (let questionIndex in gameTeamPoints.answers) {
                  if (typeof this.gameAnswersModel[questionIndex] == 'object') {
                    for (let answerOption of this.gameAnswersModel[questionIndex]){
                      if (answerOption == gameTeamPoints.answers[questionIndex]){
                        gameTeamPoints.points+=(+this.gameAnswersModel.points[questionIndex])
                      }
                    }
                  }
                  if (typeof this.gameAnswersModel[questionIndex] != 'object') {
                    if (this.gameAnswersModel[questionIndex] == gameTeamPoints.answers[questionIndex]){
                      gameTeamPoints.points+=(+this.gameAnswersModel.points[questionIndex])
                    }
                  }
                }
                this.gameTeamsPoints[gameTeamPoints.teamId]={
                  teamName: gameTeamPoints.teamName,
                  points: gameTeamPoints.points
                }
              }
              else if(this.game.answers.filter(gameTeamAnswers => gameTeamAnswers.teamId == gameTeam.id).length==0){

                this.gameTeamsPoints[gameTeam.id]={
                  teamName: gameTeam.name,
                  points: 0
                }
              }
            }


            this.firebaseService.updateGame({gameTeamsPoints: this.gameTeamsPoints}, this.game.id)



            for (let gameTeamId in this.gameTeamsPoints){
              this.gameTeamsSortedByPoints.push({
                teamId: gameTeamId,
                teamName: this.gameTeamsPoints[gameTeamId].teamName,
                points: this.gameTeamsPoints[gameTeamId].points
              })
            }
            this.gameTeamsSortedByPoints.sort(function(a, b) {
              if (a.points > b.points) {
                return -1;
              }
              if (a.points < b.points) {
                return 1;
              }
              return 0;
            });


            -------------------------------*!/


          } else {
            this.router.navigate(['/admin'])
          }
        })
      })
    })
  }*/

}
