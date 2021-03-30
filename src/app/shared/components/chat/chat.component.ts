import {AfterViewInit, ChangeDetectorRef, Component, Input} from '@angular/core';
import {get} from "scriptjs";

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
})

export class ChatComponent implements AfterViewInit {
  loadingText = "Загрузка чата ... "

  @Input() roomId
  @Input() teamName
  @Input() userName
  isOpen = false
  connection;
  chatLoading
  chatHistory = []

  constructor(public changeDetector: ChangeDetectorRef) {
  }

  closeChat() {
    this.connection.closeConnection()
  }

  init(): void {

    this.chatLoading = true
    get("https://rtcmulticonnection.herokuapp.com/dist/RTCMultiConnection.min.js", () => {
      get('https://rtcmulticonnection.herokuapp.com/socket.io/socket.io.js', () => {
        // @ts-ignore
        this.connection = new RTCMultiConnection()
        this.connection.socketURL = 'https://rtcmulticonnection.herokuapp.com:443/';
        this.connection.session = {data: true};
        this.connection.enableLogs = false;
        this.connection.iceServers = [{
          'urls': [
            'stun:stun.l.google.com:19302',
            'stun:stun1.l.google.com:19302',
            'stun:stun2.l.google.com:19302',
            'stun:stun.l.google.com:19302?transport=udp',
          ]
        }];
        this.connection.extra = {
          teamName: this.teamName,
          userName: this.userName,
        }
        this.connection.onmessage = event => {
          document.getElementById('chatInfo').style.display = 'none'
          let newMes = {
            data: {
              text: event.data.text,
              sendAt: event.data.sendAt
            },
            extra: event.extra,
            userId: event.userid
          }
          this.chatHistory.push(newMes)

          this.chatHistory = this.chatHistory.sort((a, b) => new Date(a.data.sendAt).getTime() - new Date(b.data.sendAt).getTime());

          this.changeDetector.detectChanges()

          document.getElementById('chatContainer').scrollTop = document.getElementById('chatContainer').scrollHeight;
        };
        this.connection.onopen = event => {
          this.chatLoading = false
          this.isOpen = true
          document.getElementById('chatLoading').style.display = 'none'
          document.getElementById('chatInfo').hidden = false
        };
        this.connection.openOrJoin(this.roomId + '-gameChat');
      })
    })
  }

  ngAfterViewInit() {
    document.getElementById('chatContainer').style.height = document.getElementById('chat').scrollHeight + 'px'
  }

  sendMessage(text) {
    if (text.trim()) {
      document.getElementById('chatInfo').style.display = 'none'
      this.chatHistory.push({
        data: {
          text: text,
          sendAt: Date.now()
        },
        extra: this.connection.extra,
        userId: this.connection.userid
      })
      this.connection.send({
        text: text,
        sendAt: Date.now()
      })
      this.changeDetector.detectChanges()
      document.getElementById('chatContainer').scrollTop = document.getElementById('chatContainer').scrollHeight;
    }
  }

  changeDetection() {
    this.changeDetector.detectChanges()
  }
}
