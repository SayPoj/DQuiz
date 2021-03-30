import { Component, OnInit } from '@angular/core';
import {FirebaseService} from "../../../shared/services/firebase.service";

@Component({
  selector: 'app-admin-home',
  templateUrl: './admin-home.component.html'
})
export class AdminHomeComponent implements OnInit {

  nearestGame;

  constructor(public firebaseService: FirebaseService) { }

  ngOnInit() {
    /*this.firebaseService.getNearestGame().subscribe(game =>{
      this.nearestGame = game[0]
    })*/
  }

}
