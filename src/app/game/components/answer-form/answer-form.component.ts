import {AfterViewInit, Component, EventEmitter, Input, Output} from '@angular/core';
import {FirebaseService} from "../../../shared/services/firebase.service";

@Component({
  selector: 'app-answer-form',
  templateUrl: './answer-form.component.html'
})
export class AnswerFormComponent implements AfterViewInit {

  @Input() step
  @Input() answers
  @Input() team
  @Output() save = new EventEmitter<any>();
  // @Input() save: EventEmitter<any>


  _formSubmitted = false


  constructor(public firebaseService: FirebaseService) {
  }


  addAnswer(secId, quId, answer) {
    if (this.team.answers.filter(answer => {
      return (answer.sectionId == secId && answer.questionId == quId)
    }).length == 0) {
      this.team.answers.push({
        sectionId: secId,
        questionId: quId,
        points: null,
        answer: answer
      })
    } else {
      this.team.answers.filter(answer => {
        return (answer.sectionId == secId && answer.questionId == quId)
      })[0].answer = answer
    }
    setTimeout(()=>{
      this.save.emit()
    })
  }

  ngAfterViewInit(): void {
    document.getElementById('formContainer').style.height = document.getElementById('form').scrollHeight + 'px'
  }


  formSubmitted() {
    document.getElementById('formContainer').scrollTop = 0
    this._formSubmitted = true
    setTimeout(() => {
      this._formSubmitted = false
    }, 4000)
  }


  getNgModel(secId, quId) {
    if (this.team.answers.filter(answer => {
      return (answer.sectionId == secId && answer.questionId == quId)
    }).length == 0) {
      this.team.answers.push({
        sectionId: secId,
        questionId: quId,
        points: null,
        answer: null
      })
      return this.team.answers.filter(answer => {
        return (answer.sectionId == secId && answer.questionId == quId)
      })[0].answer
    } else {
      return this.team.answers.filter(answer => {
        return (answer.sectionId == secId && answer.questionId == quId)
      })[0].answer
    }
    // this.save.emit()
  }

}
