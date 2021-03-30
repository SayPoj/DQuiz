import {Component} from '@angular/core';
import {ActivatedRoute, Params, Router} from "@angular/router";
import {FirebaseService} from "../../../shared/services/firebase.service";
import {Game} from "../../../shared/interfaces/game";
import {Title} from "@angular/platform-browser";
import {DatePipe} from '@angular/common';
import emailMask from 'text-mask-addons/dist/emailMask';

@Component({
  selector: 'app-game-registration',
  templateUrl: './game-registration.component.html',
})

export class GameRegistrationComponent {
  game: Game;
  team = {
    id: '',
    name: '',
    captain: {
      name: '',
      surname: '',
      lastName: '',
      email: '',
      phoneNumber: '',
    },
    answers: [],
    secret: Math.random().toString().substr(2, 6)
  }
  teamRegistrationForm;
  captainInfoForm;
  secret;
  checkOfComplianceWithTechnicalRequirements = false
  emailMask = emailMask;
  phoneNumberMask = ['+', '7', ' ', '(', /[1-9]/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, '-', /\d/, /\d/]

  constructor(
    private activatedRoute: ActivatedRoute,
    public router: Router,
    public firebaseService: FirebaseService,
    private titleService: Title,
    public datePipe: DatePipe
  ) {
    window.onbeforeunload = $event => {
      $event.returnValue = 'Если вы покинете страницу - данные не сохранятся'
    }
    titleService.setTitle('DQuiz | Регистрация')
    this.activatedRoute.params.subscribe((params: Params) => {
      this.firebaseService.getGame(params.gameId).subscribe(game => {
        if (!game) {
          this.router.navigate(['/not-found'])
        }
        this.game = game;
        this.titleService.setTitle('DQuiz | ' + this.game.name + ' | Регистрация')
      })
    })
  }

  newDate(date: Date) {
    date = new Date(date)
    return date.setMinutes(date.getMinutes() + 30)
  }

  teamNameMatchChecking() {
    if (!this.team.name.trim()) { return true }
    return this.game.teams.filter(team => team.name.toLowerCase().valueOf() == this.team.name.toLowerCase()).length == 0
  }

  submit() {
    this.team.id = Math.random().toString(36).substr(2, 9)
    if (this.game.teams.filter(team => team.id == this.team.id).length == 0) {
      this.game.teams.push(this.team)
      this.firebaseService.updateGame(this.game, this.game.id).then(() => {
        this.router.navigate(['game-registration/info/' + this.game.id + '/' + this.team.id + '/' + this.team.secret])
      })

      /* this.firebaseService.sendGameRegistrationInfoMail({
         from: 'Info | DQuiz <info@dquiz.ru>  ',
         message: {
           html: `


 <div style="margin: 0;
              font: 400 14px/20px Roboto, sans-serif;
              background-color: #343a40!important;
              padding: 1rem .5rem !important;">

 <div style="max-width: 990px;
             min-width: 768px;
             position: relative;
             background-color: #343a40!important;
             background-clip: border-box;
             border: 1px solid rgba(0,0,0,.125);
             border-radius: .25rem;
             margin-right: auto!important;
             margin-left: auto!important;
             margin-top: 0;
             margin-bottom: 0;">
   <div style="box-sizing: border-box;
               padding: .75rem 1.25rem;
               background-color: rgba(0,0,0,.03);
               border-bottom: 1px solid rgba(0,0,0,.125);
               border-radius: calc(.25rem - 1px) calc(.25rem - 1px) 0 0;
               -ms-flex-pack: center!important;
               justify-content: center!important;
               margin: 0!important;
               text-align: center!important;
               color: #f8f9fa!important;">
     <a href="https://dquiz.ru" style="box-sizing: border-box;color: #007bff;text-decoration: underline;background-color: transparent;">
       <img src="https://dquiz.ru/assets/logo.png" height="40px" class="d-inline-block align-top" style="box-sizing: border-box;vertical-align: top!important;border-style: none;page-break-inside: avoid;display: inline-block!important;">
     </a>
     <h2 style="box-sizing: border-box;margin-top: 0;margin-bottom: .5rem;font-weight: 500;line-height: 1.2;font-size: 2rem;orphans: 3;widows: 3;page-break-after: avoid;">Информация о регистрации команды <strong style="box-sizing: border-box;font-weight: bolder;">${this.team.name}</strong> на игру
       <strong style="box-sizing: border-box;font-weight: bolder;">${this.game.name}</strong></h2>
   </div>
   <div class="card-body" style="box-sizing: border-box;-ms-flex: 1 1 auto;flex: 1 1 auto;min-height: 1px;padding: 1.25rem;">
     <tr class=" align-items-center mx-0 mb-4 " style="box-sizing: border-box;page-break-inside: avoid;-ms-flex-align: center!important;align-items: center!important;margin-right: 0!important;margin-left: 0!important;margin-bottom: 1.5rem!important;">
       <div class="mb-2" style="box-sizing: border-box;margin-bottom: .5rem!important;">
         <img class="rounded w-100" src="${this.game.posterUrl}" style="box-sizing: border-box;vertical-align: middle;border-style: none;page-break-inside: avoid;border-radius: .25rem!important;width: 100%!important;">
       </div>
       <div class=" mx-2 px-0  pt-2 " style="box-sizing: border-box;margin-right: .5rem!important;margin-left: .5rem!important;padding-right: 0!important;padding-left: 0!important;padding-top: .5rem!important;">
         <div class=" text-left" style="box-sizing: border-box;text-align: left!important;">
           <span class="text-muted" style="box-sizing: border-box;color: #6c757d!important;"><u style="box-sizing: border-box;">Краткое описание</u>: </span>
           <span class="text-light" style="box-sizing: border-box;color: #f8f9fa!important;">${this.game.shortDescription}</span>
           <hr style="box-sizing: content-box;height: 0;overflow: visible;margin-top: 1rem;margin-bottom: 1rem;border: 0;border-top: 1px solid rgba(0,0,0,.1);">
           <span class="text-muted" style="box-sizing: border-box;color: #6c757d!important;"><u style="box-sizing: border-box;">Тематика игры</u>: </span>
           <span class="text-light" style="box-sizing: border-box;color: #f8f9fa!important;">${this.game.tags}</span>
           <hr style="box-sizing: content-box;height: 0;overflow: visible;margin-top: 1rem;margin-bottom: 1rem;border: 0;border-top: 1px solid rgba(0,0,0,.1);">
           <span class="text-muted" style="box-sizing: border-box;color: #6c757d!important;"><u style="box-sizing: border-box;">Дата и время проведения</u>: </span> <span class="text-light" style="box-sizing: border-box;color: #f8f9fa!important;"> ${this.datePipe.transform(this.game.dateTime, 'd MMMM y (EEEE) в HH:mm')} </span>

           <div class="border-left pl-2 ml-3" style="box-sizing: border-box;border-left: 1px solid #dee2e6!important;margin-left: 1rem!important;padding-left: .5rem!important;">
             <span class="text-muted" style="box-sizing: border-box;color: #6c757d!important;">Сбор с: </span>


             <span class="text-primary" style="box-sizing: border-box;color: #007bff!important;">${this.datePipe.transform(this.game.dateTime, 'HH:mm')}</span>
             <br style="box-sizing: border-box;">
             <span class="text-muted" style="box-sizing: border-box;color: #6c757d!important;">Начало в: </span>
             <span class="text-primary" style="box-sizing: border-box;color: #007bff!important;">${this.datePipe.transform(this.newDate(this.game.dateTime), 'HH:mm')}</span>

           </div>

         </div>
       </div>
     </tr>
   </div>
   <div class="card-footer" style="box-sizing: border-box;padding: .75rem 1.25rem;background-color: rgba(0,0,0,.03);border-top: 1px solid rgba(0,0,0,.125);border-radius: 0 0 calc(.25rem - 1px) calc(.25rem - 1px);">
     <a class="btn btn-lg btn-outline-primary btn-block" href="http://dquiz.ru/game-registration/info/${this.game.id}/${resolve.id}/${this.secret}" target="_blank" style="box-sizing: border-box;color: #007bff;text-decoration: none;background-color: transparent;display: block;font-weight: 400;text-align: center;vertical-align: middle;-webkit-user-select: none;-moz-user-select: none;-ms-user-select: none;user-select: none;border: 1px solid transparent;padding: .5rem 1rem;font-size: 1.25rem;line-height: 1.5;border-radius: .3rem;transition: color .15s ease-in-out,background-color .15s ease-in-out,border-color .15s ease-in-out,box-shadow .15s ease-in-out;border-color: #007bff;width: 100%;">
       Страница регистрации со всей информацией
     </a>
   </div>
 </div>
 </div>




                 `,
           subject: `Информация о регистрации команды ${this.team.name} на игру ${this.game.name}`
         },
         to: this.team.captain.email
       }).then(() => {
         this.uploading = false
         this.canLeave()

       })*/

    } else { this.submit() }
  }
}
