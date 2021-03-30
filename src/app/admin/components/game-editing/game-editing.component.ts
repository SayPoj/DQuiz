import {Component} from '@angular/core';
import {Game} from "../../../shared/interfaces/game";
import {AngularEditorConfig} from "@kolkov/angular-editor";
import {FirebaseService} from "../../../shared/services/firebase.service";
import {ActivatedRoute, Params, Router} from "@angular/router";
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {MatChipInputEvent} from '@angular/material/chips';
import {finalize, map} from "rxjs/operators";


@Component({
  selector: 'app-game-editing',
  templateUrl: './game-editing.component.html'
})

export class GameEditingComponent {
  game: Game = {}
  posterUploadProgress
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  fullDescriptionEditorConfig: AngularEditorConfig = {
    editable: true,
    placeholder: 'Добавьте расширенное описание игры ...',
    sanitize: true,
    toolbarPosition: 'top',
    toolbarHiddenButtons: [
      ['insertImage']
    ]
  };

  constructor(public firebaseService: FirebaseService,
              public router: Router,
              private activatedRoute: ActivatedRoute) {
    window.onbeforeunload = $event => { this.saveGame(); $event.returnValue = '' }
    this.activatedRoute.params.subscribe((params: Params) => {
      this.firebaseService.getGame(params.gameId).subscribe(game => {
        if (!game) { this.router.navigate(['/admin']) }
        this.game = game
        if (!this.game.state) { this.game.state = 0 }
        if (!this.game.tags) { this.game.tags = [] }
        if (!this.game.answers) { this.game.answers = [] }
        if (!this.game.teams) { this.game.teams = [] }
        if(!this.game.mediaServer) {
          this.game.mediaServer = {
            snapshotId: 631281,
            size: 'turbo-4',
            domain: 'dq-krnt.ru',
            id: null,
            ip: null,
            cors: '',
            subdomain: '@',
            price_month: null,
            price: null,
            name: null,
            ipv6: null,
            created_at: null,
            isWork: false,
            port: 8443,

            sub_status: 14,
            numberOfConnectionAttempts: 0,
            error: {
              code: null,
              info: null
            }
          }
          this.saveGame()
        }
        if(!this.game.step){this.game.step = {section: -1,question:-1}}
      })
    })
  }


  addGameTag(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;
    if ((value || '').trim()) {
      this.game.tags.push({name: value.trim()});
    }
    if (input) {
      input.value = '';
    }
  }

  removeGameTag(tag): void {
    const index = this.game.tags.indexOf(tag);
    if (index >= 0) {
      this.game.tags.splice(index, 1);
    }
  }

  saveGame() {
    this.firebaseService.updateGame(this.game, this.game.id)
  }

  uploadPoster($event) {
    let task = this.firebaseService.uploadGamePoster($event.target.files[0], this.game.id)
    this.posterUploadProgress = task.snapshotChanges().pipe(map(s => (s.bytesTransferred / s.totalBytes) * 100));
    task.snapshotChanges().pipe(
      finalize(() => {
        this.firebaseService.getGamePosterUrl(this.game.id).subscribe(poster => {
          this.game.posterUrl = poster
          this.posterUploadProgress = null
          this.saveGame()
        })
      })
    ).subscribe();
  }

  addSection(name) {
    let id = Math.random().toString(36).substr(2, 9)
    if ( this.game.answers.filter(sect => { return sect.questions.filter(ques => { return ques.id == id }).length != 0 }).length!=0) {this.addSection(name); return}

    if (name.trim() == ('' || null)) { return }
    this.game.answers.push({
      id: id,
      name: name,
      questions: []
    })
    this.saveGame()
  }

  addQuestion(name, type, section) {
    let id = Math.random().toString(36).substr(2, 9)
    if ( this.game.answers.filter(sect => { return sect.questions.filter(ques => { return ques.id == id }).length != 0 }).length!=0) {this.addQuestion(name, type, section); return}

    if (type == 'text') {
      section.questions.push({
        id: id,
        correctAnswer: 1,
        name: name,
        wrongAnswer: -1,
        type: type,
        rightAnswers: []
      })
    } else if (type == 'radio') {
      section.questions.push({
        id: id,
        correctAnswer: 1,
        name: name,
        wrongAnswer: -1,
        type: type,
        rightAnswer: null,
        answerOptions: []
      })
    }
    this.saveGame()
  }


  addRadioAnswerOption(option, question) {
    if (option.trim() == ('' || null)) {
      return
    }
    question.answerOptions.push({name: option})
    this.saveGame()
  }

  remove(arr, ind) {
    arr.splice(ind, 1);
    this.saveGame()
  }

  push(arr, data) {
    arr.push(data);
    this.saveGame()
  }
}
