import { Component} from '@angular/core';
import DetectRTC from "detectrtc";
import {Title} from "@angular/platform-browser";


@Component({
  selector: 'app-equipment-check',
  templateUrl: './equipment-check.component.html',
  styles:[`
    .scrollDownButton {
      -webkit-animation: sdb05 1.5s infinite;
      animation: sdb05 1.5s infinite;
      box-sizing: border-box;
    }

    @keyframes sdb05 {
      0% {
        transform: translate(0, -5px);
        opacity: 0;
      }
      50% {
        opacity: 1;
      }
      100% {
        transform:    translate(0, 5px);
        opacity: 0;
      }
    }
  `]

})
export class EquipmentCheckComponent{
  detectRTC = DetectRTC
  mediaDevicesArray
  mediaDevicesStream

  constructor(titleService: Title) {
    titleService.setTitle('Dquiz | Проверка оборудования и технические требования')
  }

  stopUserMedia(){
    this.selectedAudioInput = null
    this.selectedVideoInput = null
    this.mediaDevicesStream.getTracks().forEach((track) => { track.stop(); });
    this.testPlayer.srcObject.getTracks().forEach((track) => { track.stop(); });
  }

  getUserMedia() {
    alert('Камера и микрофон самостоятельно включатся на несколько секунд для проведения автоматического теста. \n Нажмите "Разершить" когда браузер спросит.')
    // @ts-ignore
    navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;
    navigator.getUserMedia({audio:true, video:true},(mediaDevicesStream)=>{

      navigator.mediaDevices.enumerateDevices().then(mediaDevices => {
        this.mediaDevicesArray={
          audioInput: [] = [],
          videoInput: [] = [],
          audioOutput: [] = []
        };
        window.open('/equipment-check#', '_self')
        for (let device of mediaDevices) {
          if (device.kind == 'audioinput') {
            this.mediaDevicesArray.audioInput.push(device)
          }
          if (device.kind == 'videoinput') {
            this.mediaDevicesArray.videoInput.push(device)
          }
          if (device.kind == 'audiooutput') {
            this.mediaDevicesArray.audioOutput.push(device)
          }

        }
        this.mediaDevicesStream = mediaDevicesStream
        setTimeout(()=>{this.stopUserMedia()})
      })
    },()=>{
      window.open('/equipment-check#', '_self')
      this.mediaDevicesArray={
        audioInput: [] = [
          {label: 'ошибка доступа'}
        ],
        videoInput: [] = [
          {label: 'ошибка доступа'}
        ],
        audioOutput: [] = [
          {label: 'ошибка доступа'}
        ]
      };
    })



    }

  selectedAudioInput;
  selectedVideoInput;
  testPlayer;
  testSteam


  checkingInputDevices() {
    this.testPlayer = document.getElementById('checkingVideoDevicesPlayer')
    // @ts-ignore
    navigator.getUserMedia = (navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia);

    if (this.selectedAudioInput && this.selectedVideoInput) {
      navigator.mediaDevices.getUserMedia({
        video: {deviceId: this.selectedVideoInput},
        audio: {deviceId: this.selectedAudioInput}
      }).then(stream => {
        this.testSteam = stream
        this.testPlayer.srcObject = null;
        window.open('/equipment-check#checkingInputDevices', '_self')
        this.testPlayer.srcObject = stream

      })
    }

    if (this.selectedAudioInput && !this.selectedVideoInput) {
      navigator.mediaDevices.getUserMedia({
        audio: {deviceId: this.selectedAudioInput}
      }).then(stream => {
        this.testSteam = stream
        this.testPlayer.srcObject = null;
        window.open('/equipment-check#checkingInputDevices', '_self')

        this.testPlayer.srcObject = stream
      })
    }

    if (!this.selectedAudioInput && this.selectedVideoInput) {
      navigator.mediaDevices.getUserMedia({
        video: {deviceId: this.selectedVideoInput},
      }).then(stream => {
        this.testSteam = stream
        this.testPlayer.srcObject = null;
        window.open('/equipment-check#checkingInputDevices', '_self')
        this.testPlayer.srcObject = stream
      })
    }

  }

}
