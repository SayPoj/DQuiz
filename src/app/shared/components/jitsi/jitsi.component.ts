import {Component, OnInit} from '@angular/core';
import {get} from 'scriptjs'


@Component({
  selector: 'app-jitsi',
  template: `
    <div class="w-100 h-100 bg-dark" id="jitsiLoading">
      <div class="w-100 h-100 card-header rounded-0 border-0">
        <app-loading-fire textColor="light" text="Загрузка конференции ... "></app-loading-fire>
      </div>
    </div>
    <div *ngIf="isMeetingOn"
      class="position-absolute w-100"
      style=" height: 100px; background-color: #343a40; "
    ></div>
    <div class="alert alert-warning alert-dismissible fade show position-absolute w-100" role="alert">
      Ваши камера и микрофон по умолчанию выключены.
      <hr>
      Включите их на панели настроек внизу перед началом участия в конференции.
      <button type="button" class="close" data-dismiss="alert" aria-label="Close">
        <span aria-hidden="true">&times;</span>
      </button>
    </div>
    <div id="meet" class="w-100 h-100"  #meet></div>`
})


export class JitsiComponent {

  isLoading = false

  private api;
  isMeetingOn: boolean = false;

  init(roomName: string, userName: string, roomSubject: string) {
    this.showLoading(true)

    get('https://meet.jit.si/external_api.js', () => {

      // @ts-ignore
      window.JitsiMeetExternalAPI = window.JitsiMeetExternalAPI || window.exports.JitsiMeetExternalAPI;
      // @ts-ignore
      this.api = new JitsiMeetExternalAPI('meet.jit.si', {
        roomName: roomName,
        parentNode: document.querySelector('#meet'),
        configOverwrite: {
          startWithAudioMuted: true,
          defaultLanguage: 'ru',
          enableCalendarIntegration: false,
          enableInsecureRoomNameWarning: false,
          disableInviteFunctions: true,
          doNotStoreRoom: true,
          startWithVideoMuted: true,
          enableWelcomePage: false,
          prejoinPageEnabled: false,
          disableDeepLinking:true,
          subject: roomSubject,
          remoteVideoMenu: {
              disableKick: true
          },
          rtcstatsEnabled: false,



        //  enableUserRolesBasedOnToken : false
        //  remoteVideoMenu: { disableKick: true }, disableRemoteMute: true, - если пользователь капитан (возможность удалить из комнаты и отключить звук)
        },
        interfaceConfigOverwrite: {
          APP_NAME: 'DQuiz Conference',
          HIDE_DEEP_LINKING_LOGO: true,
          DEFAULT_BACKGROUND: '#343a40',
          CONNECTION_INDICATOR_DISABLED: true,
          DEFAULT_REMOTE_DISPLAY_NAME: 'Участник команды',
          DEFAULT_LOCAL_DISPLAY_NAME: "я",
          DISABLE_VIDEO_BACKGROUND: true,
          DISABLE_JOIN_LEAVE_NOTIFICATIONS: true,
          DISABLE_RINGING : false,
          DISABLE_TRANSCRIPTION_SUBTITLES : false,
          DISPLAY_WELCOME_PAGE_CONTENT : false ,
          DISPLAY_WELCOME_PAGE_TOOLBAR_ADDITIONAL_CONTENT : false ,
          GENERATE_ROOMNAMES_ON_WELCOME_PAGE : false,
          HIDE_INVITE_MORE_HEADER : true,
          LANG_DETECTION: true,
          MOBILE_APP_PROMO: false,
          NATIVE_APP_NAME: 'DQuiz Conference',
          PROVIDER_NAME: 'DQuiz',
          // HIDE_KICK_BUTTON_FOR_GUESTS: ложь,
          SHOW_BRAND_WATERMARK : true,
          SHOW_CHROME_EXTENSION_BANNER: false,
          SHOW_JITSI_WATERMARK: false,
          SHOW_DEEP_LINKING_IMAGE : false,
          SHOW_WATERMARK_FOR_GUESTS: false,
          SHOW_POWERED_BY : false,
          VIDEO_QUALITY_LABEL_DISABLED : true,
          TOOLBAR_BUTTONS: [
            'microphone',
            'camera',
            'fodeviceselection',
            // 'chat',
            'videoquality',
            'mute-everyone',
            'tileview'
          ],
          DISABLE_PRESENCE_STATUS: true,
          DEFAULT_LOGO_URL : '',
          ENFORCE_NOTIFICATION_AUTO_DISMISS_TIMEOUT: 5000,
          TILE_VIEW_MAX_COLUMNS: 2,


          TOOLBAR_ALWAYS_VISIBLE: true,
          INITIAL_TOOLBAR_TIMEOUT : 0 ,
          TOOLBAR_TIMEOUT: 1000 // скорость скрытия тулбара

        },
        userInfo: {displayName: userName},
        onload: () => {
          // console.log('load')
          this.showLoading(false)
          document.getElementById('meet')
          // console.error(this.api)
          this.isMeetingOn = true
          this.api.executeCommand('setVideoQuality', 180);



        }
      });
    })
  }
  showLoading(show){
    if(show){
      this.isLoading = true
      document.getElementById('meet').hidden=true
      document.getElementById('jitsiLoading').hidden=false
    }else{
      this.isLoading = false
      document.getElementById('meet').hidden=false
      document.getElementById('jitsiLoading').hidden=true
    }
  }
}
