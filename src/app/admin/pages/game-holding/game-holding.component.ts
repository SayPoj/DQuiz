import {ChangeDetectorRef, Component, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import {ActivatedRoute, Params, Router} from "@angular/router";
import {FirebaseService} from "../../../shared/services/firebase.service";
import {BroadcastingComponent} from "../../../shared/components/broadcasting/broadcasting.component";
import {Game} from "../../../shared/interfaces/game";
import {Title} from "@angular/platform-browser";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {catchError} from "rxjs/operators";
import {BehaviorSubject} from "rxjs";
import {ChatComponent} from "../../../shared/components/chat/chat.component";


export enum MediaServerWorkStatus {
  error, // Ошибка
  /*создание*/
  creature, // Создание
  created, // Создан
  switchingOn, // Включение
  switchedOn, // Включен
  loading, // Загрузка
  loaded, // Загружен
  binding, // Привязывание к домену
  binded, // Привязан к домену
  work, // Работает
  /*Удаление*/
  deletion, // Удаление сервера
  deleted, // Удален
  unbinding, // Отвязывание от домена
  unbinded, //Отвязано от домена
  notCreated// не создан
}

export interface TeamAnswers {
  team?: {
    name?,
    id?
  },
  section?: {
    id?,
    questions?: {
      id?,
      answer?
    }[]
  }[],
}


@Component({
  selector: 'app-game-holding',
  templateUrl: './game-holding.component.html',
  encapsulation: ViewEncapsulation.None,
  styles: [`


    .my-custom-class .tooltip-inner {
      background-color: #6c757d !important;
      width: 400px;
      padding: 0;
    }

    .my-custom-class .arrow::before {
      border-top-color: #6c757d !important;
    }


    video::-webkit-media-controls-timeline {
      display: none;
    }

    video::-webkit-media-controls-play-button {
      display: none;
    }

    video::-webkit-media-controls-current-time-display {
      display: none;
    }

    video {
      object-fit: cover;
    }


  `]
})


export class GameHoldingComponent{

  @ViewChild(BroadcastingComponent) broadcastingComponent: BroadcastingComponent

  /*
   document.getElementById('video').setAttribute('controls', '')
    // @ts-ignore
    document.getElementById('video').setAttribute('poster', this.poster)
  */

  game: Game;

  previousGame: Game = {};
  mediaDevicesArray = {
    audioInput: [],
    videoInput: [],
  };
  selectedAudioInput;
  selectedVideoInput;
  testPlayer;
  testSteam
  chatComponent

  @ViewChild(ChatComponent) set startChat(chatComponent: ChatComponent) {
    if (chatComponent && !chatComponent.chatLoading && !chatComponent.isOpen) {
      chatComponent.init();
      this.chatComponent = chatComponent
    }
  }

  questions = []

  public mediaServerStatus: BehaviorSubject<MediaServerWorkStatus> = new BehaviorSubject<MediaServerWorkStatus>(MediaServerWorkStatus.notCreated);

  constructor(private activatedRoute: ActivatedRoute,
              public router: Router,
              public firebaseService: FirebaseService,
              private titleService: Title,
              private http: HttpClient,
              public changeDetector: ChangeDetectorRef
  ) {
    window.onbeforeunload = $event => {
      $event.returnValue = 'Аккуратней, изменения могу не сохраниться'
    }
    // @ts-ignore
    navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;
    this.getMediaDevices()
    titleService.setTitle('DQuiz | Проведение игры')
    this.activatedRoute.params.subscribe((params: Params) => {
      this.firebaseService.getGame(params.gameId).subscribe(game => {
        if (!game) {
          this.router.navigate(['/admin'])
        }
        // console.log(game)
        // if(game && this.game && JSON.parse(JSON.stringify(game))==JSON.parse(JSON.stringify(this.game))){return}
        // if(game && this.game){ console.log(JSON.parse(JSON.stringify(game))==JSON.parse(JSON.stringify(this.game))) }


        this.game = game;

        this.titleService.setTitle('DQuiz | Проведение игры | ' + this.game.name + '| Admin')
        this.mediaServerStatus.next(this.game.mediaServer.sub_status)


        if (JSON.stringify(this.previousGame.teams) !== JSON.stringify(this.game.teams) || JSON.stringify(this.previousGame.answers) !== JSON.stringify(this.game.answers)) {
          this.questions = []
          for (let section of this.game.answers) {
            for (let question of section.questions) {
              let sectionQuestion
              if (question.type == 'radio') {
                sectionQuestion = {
                  section: {
                    id: section.id,
                    name: section.name,
                    length: section.questions.length
                  },
                  question: {
                    id: question.id,
                    correctAnswer: question.correctAnswer,
                    name: question.name,
                    wrongAnswer: question.wrongAnswer,
                    type: question.type,
                    rightAnswer: question.rightAnswer,
                    answerOptions: question.answerOptions
                  }
                }
              }
              if (question.type == 'text') {
                sectionQuestion = {
                  section: {
                    id: section.id,
                    name: section.name,
                    length: section.questions.length
                  },
                  question: {
                    id: question.id,
                    correctAnswer: question.correctAnswer,
                    name: question.name,
                    wrongAnswer: question.wrongAnswer,
                    type: question.type,
                    rightAnswers: question.rightAnswers
                  }
                }
              }
              this.questions.push(sectionQuestion)
            }
          }
          this.checkingAnswers()
        }
        this.previousGame = game
      })
    })
  }

  getMediaDevices() {
    this.mediaDevicesArray.audioInput = []
    this.mediaDevicesArray.videoInput = []
    navigator.mediaDevices.enumerateDevices().then(mediaDevices => {
      for (let device of mediaDevices) {
        if (device.kind == 'audioinput') {
          this.mediaDevicesArray.audioInput.push(device)
        }
        if (device.kind == 'videoinput') {
          this.mediaDevicesArray.videoInput.push(device)
        }
      }
    })
  }

  changeShowBroadcast() {
    if (this.game.showBroadcast) {
      if (this.testSteam) {
        for (let input of this.testSteam.getTracks()) {
          input.stop()
        }
      }
      this.startBroadcasting()
    } else {
      this.updateGame({state: 2, showBroadcast: this.game.showBroadcast})
      if (this.broadcastingComponent) {
        this.broadcastingComponent.stop()
      }
      this.selectedAudioInput = null
      this.selectedVideoInput = null
    }
  }

  updateGame(data) {
    this.firebaseService.updateGame(data, this.game.id)
  }

  setState(state) {
    if (state == 2 && (this.game.state == 3 || this.game.state == 1)) {
      this.updateGame({state: state})
      return
    }
    if (state == 2 && this.game.state == 2 && this.game.showBroadcast) {
      this.updateGame({state: 3})
      return
    }
    if (state == 2 && this.game.state == 2 && !this.game.showBroadcast) {
      this.updateGame({state: 1})
      return
    }
    if (state == 4 || state == 5) {
      this.changeStepSection(null)
      this.game.showBroadcast = false
      this.changeShowBroadcast()
    }
    if (state == 5) {
      this.updateGame({showChat: false})
    }
    this.updateGame({state: state})

  }

  changeStepSection(secIndex) {
    this.updateGame({step: {section: secIndex, question: null}})
  }

  changeStepQuestion(quesIndex) {
    this.updateGame({step: {section: this.game.step.section, question: quesIndex}})
  }

  checkingInputDevices() {

    document.getElementById('checkingInputDevicesContainer').hidden = false
    this.testPlayer = document.getElementById('checkingVideoDevicesPlayer')


    this.testPlayer.volume = 1

    if (this.selectedAudioInput && this.selectedVideoInput) {
      navigator.mediaDevices.getUserMedia({
        video: {deviceId: this.selectedVideoInput},
        audio: {deviceId: this.selectedAudioInput}
      }).then(stream => {
        this.testSteam = stream
        this.testPlayer.srcObject = stream
      })
    }
    if (this.selectedAudioInput && !this.selectedVideoInput) {
      navigator.mediaDevices.getUserMedia({
        audio: {deviceId: this.selectedAudioInput}
      }).then(stream => {
        this.testSteam = stream
        this.testPlayer.srcObject = stream
      })
    }
    if (!this.selectedAudioInput && this.selectedVideoInput) {

      navigator.mediaDevices.getUserMedia({
        video: {deviceId: this.selectedVideoInput},
      }).then(stream => {
        this.testSteam = stream
        this.testPlayer.srcObject = stream
      })
    }
  }


  /**********************************************************************************************************************/
  startBroadcasting() {
    if (this.selectedAudioInput && this.selectedVideoInput && this.game.showBroadcast) {
      if (confirm('Вы уверены, что хотите выйти в эфир?')) {


        this.broadcastingComponent.presenter(this.selectedVideoInput, this.selectedAudioInput)
        this.updateGame({state: 3, showBroadcast: this.game.showBroadcast})

      } else {
        this.game.showBroadcast = false
        // @ts-ignore
        document.getElementById('state2').checked = false
      }
    }
  }

  regRuApiUser = {
    password: "CStgZwChOSMZ",
    username: "drvquiz@gmail.com"
  }


  createMediaServer() {


    this.game.mediaServer.isWork = false

    this.game.mediaServer.sub_status = MediaServerWorkStatus.creature

    console.log('create')
    this.http
      .post(
        'https://dq-cors.ru/' + 'https://api.cloudvps.reg.ru/v1/reglets',
        {
          size: this.game.mediaServer.size,
          image: this.game.mediaServer.snapshotId
        },
        {
          headers: new HttpHeaders({
            'Authorization': 'Bearer cc36843d19ee7323c0f61b116d377cf2aa533504785a92a1b552dd5e59ad2f3eadbeb7f6c71215e302ca17d858619cf0',
            'Content-Type': 'application/json'
          })
        })
      .pipe(
        // @ts-ignore
        catchError(() => {
          setTimeout(() => {
            this.createMediaServer()
          }, 2000)
        })
      )
      .subscribe(res => {
        this.game.mediaServer.id = res.reglet.id
        this.game.mediaServer.ip = res.reglet.ip
        this.game.mediaServer.name = res.reglet.name
        this.game.mediaServer.ipv6 = res.reglet.ipv6
        this.game.mediaServer.created_at = res.reglet.created_at
        this.game.mediaServer.status = res.reglet.status
        this.game.mediaServer.sub_status = MediaServerWorkStatus.created
        this.updateGame({mediaServer: this.game.mediaServer})
        this.getMediaServeInclusionStatus()
      });
  }

  checkCors() {




        this.http.get(
          'https://dq-cors.ru/https://api.cloudvps.reg.ru/v1/reglets',
          {
            headers: new HttpHeaders({
              'Authorization': 'Bearer cc36843d19ee7323c0f61b116d377cf2aa533504785a92a1b552dd5e59ad2f3eadbeb7f6c71215e302ca17d858619cf0',
              'Content-Type': 'application/json'
            })
          })
          .pipe(
            // @ts-ignore
            catchError(() => {
              setTimeout(() => {
                this.checkCors()
              }, 2000)
            })
          )
          .subscribe(servers => {
            alert('CORS Work!')
          })
  }

  getMediaServeInclusionStatus() {

    this.game.mediaServer.sub_status = MediaServerWorkStatus.switchingOn
    this.http.get(
      'https://dq-cors.ru/https://api.cloudvps.reg.ru/v1/reglets',
      {
        headers: new HttpHeaders({
          'Authorization': 'Bearer cc36843d19ee7323c0f61b116d377cf2aa533504785a92a1b552dd5e59ad2f3eadbeb7f6c71215e302ca17d858619cf0',
          'Content-Type': 'application/json'
        })
      })
      .pipe(
        // @ts-ignore
        catchError(error => {
          if (error) {
            setTimeout(() => {
              this.getMediaServeInclusionStatus()
            }, 10000)
          }
        })
      )
      .subscribe(servers => {
        // @ts-ignore
        let server = servers.reglets.filter(server => {
          return server.id == this.game.mediaServer.id
        })[0]

        if (server.status == 'active') {
          this.game.mediaServer.sub_status = MediaServerWorkStatus.switchedOn
          this.updateGame({mediaServer: this.game.mediaServer})


          setTimeout(() => {
            console.log(server)
            window.open('https://' + server.ip + ':8443', '_blanc')
            this.game.mediaServer.ip = server.ip
            this.game.mediaServer.ipv6 = server.ipv6
            this.game.mediaServer.name = server.name
            this.game.mediaServer.price = server.size.price
            this.game.mediaServer.price_month = server.size.price_month
            this.game.mediaServer.created_at = server.created_at
            this.game.mediaServer.status = server.status
            this.game.mediaServer.sub_status = MediaServerWorkStatus.switchedOn
            this.updateGame({mediaServer: this.game.mediaServer})
            this.waitingMediaServerLoad()
          }, 600)
        }

        if (server.status == 'new') {
          setTimeout(() => {
            this.getMediaServeInclusionStatus()
          }, 10000)
        }

        if (server.status == 'suspended') {


          this.game.mediaServer.error.code = 'Невозможно создать медиасервер: сервер приостановлен (недостаточно средств).'
          this.game.mediaServer.error.info = null
          this.game.mediaServer.sub_status = MediaServerWorkStatus.error
          this.updateGame({mediaServer: this.game.mediaServer})
        }
      })
  }

  waitingMediaServerLoad() {

    if (this.game.mediaServer.sub_status == MediaServerWorkStatus.loading || this.game.mediaServer.sub_status == MediaServerWorkStatus.switchedOn) {
      this.game.mediaServer.sub_status = MediaServerWorkStatus.loading



      /*this.http.get('https://dq-cors.ru/' + 'https://' + this.game.mediaServer.ip + ':8443/img/webrtc.png',
      {responseType: 'blob'})
        .pipe(
          // @ts-ignore
          catchError(() => {
            this.game.mediaServer.numberOfConnectionAttempts += 1
            this.updateGame({mediaServer: this.game.mediaServer})

            if (this.game.mediaServer.numberOfConnectionAttempts >= 30) {
              this.restartMediaServer()
              return
            }

            setTimeout(() => {
              this.waitingMediaServerLoad()
            }, 10000)
          })
        )
        .subscribe(() => {
          this.game.mediaServer.sub_status = MediaServerWorkStatus.loaded
          this.game.mediaServer.numberOfConnectionAttempts = 0
          this.updateGame({mediaServer: this.game.mediaServer})
          this.bindDomainToIP()
        })*/

      let img = document.body.appendChild(document.createElement("img"));
      img.style.display = 'none'
      img.onload = () => {
        img.parentNode.removeChild(img)


        this.game.mediaServer.sub_status = MediaServerWorkStatus.loaded
        this.game.mediaServer.numberOfConnectionAttempts = 0
        this.updateGame({mediaServer: this.game.mediaServer})
        this.bindDomainToIP()

      };
      img.src = 'https://' + this.game.mediaServer.ip + ':8443/img/webrtc.png';

      img.onerror = () => {
        this.game.mediaServer.numberOfConnectionAttempts += 1
        this.updateGame({mediaServer: this.game.mediaServer})

        if (this.game.mediaServer.numberOfConnectionAttempts >= 30) {
          this.restartMediaServer()
          return
        }

        setTimeout(() => {
          this.waitingMediaServerLoad()
        }, 10000)

        img.parentNode.removeChild(img)
      };
    }
  }

  bindDomainToIP() {
    this.game.mediaServer.sub_status = MediaServerWorkStatus.binding
    let form = {
      input_format: "json",
      output_format: "json",
      io_encoding: "utf8",
      input_data: JSON.stringify({
        "domains": [
          {
            "dname": this.game.mediaServer.domain
          }
        ],
        "ipaddr": this.game.mediaServer.ip,
        "password": this.regRuApiUser.password,
        "subdomain": this.game.mediaServer.subdomain,
        "username": this.regRuApiUser.username
      }),
      show_input_params: 0,
    };

    var postData = [];
    for (var key in form) {
      if (!form.hasOwnProperty(key)) continue;
      postData.push(key + "=" + form[key]);
    }

    this.http
      .post(
        'https://dq-cors.ru/https://api.reg.ru/api/regru2/zone/add_alias?' + postData.join("&"),
        {},
        {
          headers: new HttpHeaders({
            'Content-Type': 'application/x-www-form-urlencoded'
          })
        })
      .pipe(
        // @ts-ignore
        catchError(() => {
          setTimeout(() => {
            this.bindDomainToIP()
          }, 10000)
        })
      )
      .subscribe(res => {
        // @ts-ignore
        if (res.answer.domains[0].result == 'success') {
          this.game.mediaServer.isWork = true
          this.game.mediaServer.sub_status = MediaServerWorkStatus.binded
          this.game.mediaServer.isWork = true
          this.game.mediaServer.sub_status = MediaServerWorkStatus.work
          this.game.mediaServer.error.code = null
          this.game.mediaServer.error.info = null
          this.game.mediaServer.numberOfConnectionAttempts = 0
          this.updateGame({mediaServer: this.game.mediaServer})
          window.open('https://dq-krnt.ru:8443', '_blanc')
          alert('Медиасервер создан')
        } else {
          this.game.mediaServer.error.code = 'Ошибка привязывания к домену.'
          this.game.mediaServer.error.info = res
          this.game.mediaServer.sub_status = MediaServerWorkStatus.error
          this.updateGame({mediaServer: this.game.mediaServer})
        }
      });
  }

  deleteMediaServer() {

    this.game.showBroadcast = false
    this.changeShowBroadcast()
    this.game.mediaServer.isWork = false

    this.game.mediaServer.sub_status = MediaServerWorkStatus.deletion
    this.updateGame({mediaServer: this.game.mediaServer})
    this.http
      .delete(
        'https://dq-cors.ru/https://api.cloudvps.reg.ru/v1/reglets/' + this.game.mediaServer.id,
        {
          headers: new HttpHeaders({
            'Authorization': 'Bearer cc36843d19ee7323c0f61b116d377cf2aa533504785a92a1b552dd5e59ad2f3eadbeb7f6c71215e302ca17d858619cf0',
            'Content-Type': 'application/json'
          })
        })
      .pipe(
        // @ts-ignore
        catchError(error => {
          if (error.error.code == 'NO_SUCH_REGLET' && error.status == 400) {
            this.game.mediaServer.sub_status = MediaServerWorkStatus.deleted
            this.updateGame({mediaServer: this.game.mediaServer})
            this.unbindDomainToIP()
            return
          } else {
            setTimeout(() => {
              this.deleteMediaServer()
            }, 10000)
          }
        })
      )
      .subscribe(() => {
        this.game.mediaServer.sub_status = MediaServerWorkStatus.deleted
        this.updateGame({mediaServer: this.game.mediaServer})
        this.unbindDomainToIP()
      });
  }

  unbindDomainToIP() {

    this.game.mediaServer.sub_status = MediaServerWorkStatus.unbinding
    this.updateGame({mediaServer: this.game.mediaServer})
    var form = {
      input_format: "json",
      output_format: "json",
      io_encoding: "utf8",
      input_data: JSON.stringify({
        "content": this.game.mediaServer.ip,
        "domains": [
          {
            "dname": this.game.mediaServer.domain
          }
        ],
        "record_type": "A",
        "password": this.regRuApiUser.password,
        "subdomain": this.game.mediaServer.subdomain,
        "username": this.regRuApiUser.username
      }),
      show_input_params: 0,
    };
    var postData = [];
    for (var key in form) {
      if (!form.hasOwnProperty(key)) continue;
      postData.push(key + "=" + form[key]);
    }

    this.http
      .post(
        'https://dq-cors.ru/https://api.reg.ru/api/regru2/zone/remove_record?' + postData.join("&"),
        {},
        {
          headers: new HttpHeaders({
            'Content-Type': 'application/x-www-form-urlencoded'
          })
        })
      .pipe(
        // @ts-ignore
        catchError(() => {
          setTimeout(() => {
            this.unbindDomainToIP()
          }, 10000)
        })
      )
      .subscribe(res => {
        // console.log(res)
        if (res.answer.domains[0].result == 'success' || res.answer.domains[0].error_code == 'RR_NOT_FOUND') {
          this.game.mediaServer.id = null
          this.game.mediaServer.ip = null
          this.game.mediaServer.ipv6 = null
          this.game.mediaServer.price = null
          this.game.mediaServer.price_month = null
          this.game.mediaServer.name = null
          this.game.mediaServer.created_at = null
          this.game.mediaServer.isWork = false
          this.game.mediaServer.error.code = null
          this.game.mediaServer.error.info = null
          this.game.mediaServer.numberOfConnectionAttempts = 0
          this.game.mediaServer.sub_status = MediaServerWorkStatus.notCreated
          this.updateGame({mediaServer: this.game.mediaServer})
          alert('Медиасервер удален')

        } else {


          this.game.mediaServer.error.code = 'Ошибка отвязывания от домена.'
          this.game.mediaServer.error.info = JSON.stringify(res)
          this.game.mediaServer.sub_status = MediaServerWorkStatus.error
          this.updateGame({mediaServer: this.game.mediaServer})
        }
      });
  }

  restartMediaServer() {
    console.clear()
    this.game.mediaServer.error.code = null
    this.game.mediaServer.error.info = null
    this.game.mediaServer.numberOfConnectionAttempts = 0

    this.deleteMediaServer()
    let $restartMediaServerPendingDeletion = this.mediaServerStatus.subscribe(code => {
      if (code == 14) {
        this.createMediaServer()
        $restartMediaServerPendingDeletion.unsubscribe()
      }
    })
  }

  /**********************************************************************************************************************/

  teamsAnswers: TeamAnswers[] = [];

  checkingAnswers() {

    for (let team of this.game.teams) {
      team.totalPoints=0
      for (let teamAnswer of team.answers) {
        let questionAnswer = this.game.answers.filter(sec => sec.id == teamAnswer.sectionId)[0].questions.filter(qu => qu.id == teamAnswer.questionId)[0]
        if (questionAnswer && questionAnswer.type == 'radio') {
          if (teamAnswer.answer != null && questionAnswer.rightAnswer != null && questionAnswer.rightAnswer.toString() == teamAnswer.answer.toString()) {
            teamAnswer.points = questionAnswer.correctAnswer
          } else (
            teamAnswer.points = questionAnswer.wrongAnswer
          )
        }
        if (questionAnswer && questionAnswer.type == 'text') {

          if (teamAnswer.answer && questionAnswer.rightAnswers.filter(rA => rA.name.toString().trim().toLocaleLowerCase() === teamAnswer.answer.toString().trim().toLocaleLowerCase()).length != 0) {
            teamAnswer.points = questionAnswer.correctAnswer
          } else (
            teamAnswer.points = questionAnswer.wrongAnswer
          )

        }
      }
      team.answers.forEach(answer=>{
        team.totalPoints += +answer.points
      })
    }
    this.updateGame({teams: this.game.teams})


  }

  getTeamAnswer(teamId, secId, quesId) {
    let _getTeamAnswer = this.game.teams.filter(team => team.id == teamId)[0].answers.filter(answer=>{ return (answer.questionId == quesId && answer.sectionId == secId)})[0]
    if (_getTeamAnswer && _getTeamAnswer.answer){ return _getTeamAnswer }
  }

  getRadioAnswer( secId, quesId, optId){
    return this.game.answers.filter(sec=>sec.id==secId)[0].questions.filter(ques=>ques.id==quesId)[0].answerOptions[+optId].name
  }

  addRightAnswer(secId, quesId, answer) {
    if (this.game.answers.filter(sec => sec.id == secId)[0].questions.filter(qu => qu.id == quesId)[0].rightAnswers.filter(ans => ans.name == answer).length == 0) {
      this.game.answers.filter(sec => sec.id == secId)[0].questions.filter(qu => qu.id == quesId)[0].rightAnswers.push({name: answer})
      this.updateGame({answers: this.game.answers})
    }
  }

  delRightAnswer(secId, quesId, answer) {

    if (this.game.answers.filter(sec => sec.id == secId)[0].questions.filter(qu => qu.id == quesId)[0].rightAnswers.filter(ans => ans.name == answer).length != 0) {
      this.game.answers.filter(sec => sec.id == secId)[0].questions.filter(qu => qu.id == quesId)[0].rightAnswers = this.game.answers.filter(sec => sec.id == secId)[0].questions.filter(qu => qu.id == quesId)[0].rightAnswers.filter(ans => ans.name != answer)
      this.updateGame({answers: this.game.answers})
    }
  }


}
