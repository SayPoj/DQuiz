import {AfterViewInit, Component, Input} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import * as kurentoUtils from 'kurento-utils';

export enum VideoStatus {
  Loading,
  Play,
  Stop
}

@Component({
  selector: 'app-broadcasting',
  templateUrl: './broadcasting.component.html',
  styles:[`


    video::-webkit-media-controls-timeline {
      display: none;
    }
    video::-webkit-media-controls-play-button  {
      display: none;
    }
    video::-webkit-media-controls-current-time-display {
      display: none;
    }

    video{ object-fit: cover; }


  `]
})

export class BroadcastingComponent implements AfterViewInit {



  @Input() loadingText: string
  @Input() loadingTextColor: string
  @Input() soundControlPermission: boolean
  @Input() domain: string
  @Input() subdomain: string
  @Input() port: number
  @Input() poster: number

  public status: BehaviorSubject<VideoStatus> = new BehaviorSubject(VideoStatus.Stop);


  video
  webRtcPeer: any;
  ws: WebSocket
  isJoining = false
  isStream = false;
  isLocal: boolean;
  isOnline = false



  ngAfterViewInit(): void {
    this.video = document.getElementById('video')
    this.video.muted = true
    this.subdomain = (this.subdomain=='@')?'':`${this.subdomain}.`
    this.ws =  new WebSocket('wss://' + this.subdomain + this.domain + ':'+this.port+'/one2many');
    window.onbeforeunload = () => {
      this.ws.close();
    }
    this.ws.onmessage = (message: MessageEvent) => {
      let parsedMessage = JSON.parse(message.data);

      switch (parsedMessage.id) {
        case 'stop':
          this.stop()
          break;
        case 'presenterResponse':
          this.response(parsedMessage);
          break;
        case 'viewerResponse':
          this.response(parsedMessage);
          break;
        case 'stopCommunication':
          this.dispose();
          break;
        case 'iceCandidate':
          this.webRtcPeer.addIceCandidate(parsedMessage.candidate, error => {
            if (error) return console.error("Error adding candidate: " + error);
          });
          break;
        default:
          console.error('Unrecognized message', parsedMessage);
      }
    }
  }

  response(message) {
    if (message.response != 'accepted') {
      let errorMsg = message.message ? message.message : 'Unknown error';
      console.clear()
      console.warn('Call not accepted for the following reason: ', errorMsg);
      this.stop();

      setTimeout(()=>{this.viewer()}, 2000)
      /*if (message.id == 'presenterResponse' && message.response == 'rejected') {
        console.log('Connect as a viewer')
        this.viewer()
      }*/
    } else {
      this.webRtcPeer.processAnswer(message.sdpAnswer);
    }
  }

  viewer(): void {

    if (this.webRtcPeer) return;
    this.ws.onopen = ()=>{
      console.log('connection open')
    }
    if(this.soundControlPermission){
      document.getElementById('video').setAttribute('controls', '')
    }
    setTimeout(()=>{
      this.isLocal=false
      this.status.next(VideoStatus.Loading);
      const options = {
        remoteVideo: this.video,
        onicecandidate: (candidate) => {
          console.log(candidate)
          this.sendMessage({
            id: "onIceCandidate",
            candidate: candidate});
        },
      };

      this.webRtcPeer = new kurentoUtils.WebRtcPeer.WebRtcPeerRecvonly(options, error => {
          if (error) {
            return console.error(error);
          }

          this.webRtcPeer.generateOffer((a, b) => this.onOfferViewer(a, b));
      });
    },1000)
  }

  presenter(videoInputSource: string, audioInputSource: string) {
    if (this.webRtcPeer) return;
    this.isLocal=true
    this.status.next(VideoStatus.Loading);
    this.ws.onopen = ()=>{
      console.log('connection open')
    }
      let options = {
        localVideo: this.video,
        onicecandidate: (candidate) => {
          this.sendMessage({
            id: "onIceCandidate",
            candidate: candidate,
          });
        },
        mediaConstraints: {
          video: {
            mandatory: {
              minFrameRate: 3,
              maxFrameRate: 64,
            },
            optional: [{sourceId: videoInputSource}]
          },
          audio: {
            mandatory: {},
            optional: [{sourceId: audioInputSource}]
          }
        }
      }
      this.webRtcPeer = kurentoUtils.WebRtcPeer.WebRtcPeerSendonly(options, error => {
        if (error) {
          this.stop()
          return console.error(error); }
        this.webRtcPeer.generateOffer((a, b) => this.onOfferPresenter(a, b));
      })


  }

  onOfferPresenter(error, offerSdp) {
    if (error) {
      return console.error("Error generating the presenter offer");
    }
    this.sendMessage({
      id: "presenter",
      sdpOffer: offerSdp
    })
  }

  onOfferViewer(error, offerSdp) {
    if (error) {
      return console.error("Error generating the viewer offer", error);
    }

    this.sendMessage({
      id: "viewer",
      sdpOffer: offerSdp
    })

  }

  sendMessage(message) {
    this.ws.send(JSON.stringify(message));
  }

  startResponse(message): void {
    this.webRtcPeer.processAnswer(message.sdpAnswer, (error) => {
      if (error) {
        return console.error(error);
      }
    });
  }

  stop() {
    this.status.next(VideoStatus.Stop);
    if (this.webRtcPeer) {
      this.sendMessage({id: 'stop'});
      this.dispose();
    }
  }

  dispose() {
    if (this.webRtcPeer) {
      this.webRtcPeer.dispose();
      this.webRtcPeer = null;
    }
  }
}




