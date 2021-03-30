import {Injectable} from '@angular/core';
import {AngularFirestore} from '@angular/fire/firestore';
import {Game, Games} from "../interfaces/game";
import {AngularFireStorage} from "@angular/fire/storage";
import {Observable} from "rxjs";
import {DatePipe} from "@angular/common";
import firebase from "firebase/app";
import FieldValue = firebase.firestore.FieldValue;


@Injectable({
  providedIn: 'root'
})

export class FirebaseService {

  constructor(
    public db: AngularFirestore,
    private afStorage: AngularFireStorage,
    public datePipe: DatePipe
  ) {
  }

  firebase = firebase

  createGame(game: Game) {
    return this.db.collection('Games').add(game)
  }

  getGames():Observable<Games> {
    return this.db.collection('Games').valueChanges();
  }

  getGame(gameId) {
    return this.db.collection('Games').doc(gameId).valueChanges();
  }

  uploadGamePoster(poster, gameId) {
    return this.afStorage.ref('GamePosters/' + gameId).put(poster)
  }

  getGamePosterUrl(gameId) {
    return this.afStorage.ref('GamePosters/' + gameId).getDownloadURL()
  }

  updateGame(data, gameId) {
    return this.db.collection('Games').doc(gameId).update(data)
  }

  /*sendGameRegistrationInfoMail(mail){
    return this.db.collection('mail').add(mail)
  }*/

  /*getNearestGame(){
     return this.db.collection('Games', ref => ref.where('dateTime', '>',this.datePipe.transform(Date.now(),'yyyy-MM-ddTHH:MM') ).orderBy("dateTime", "asc").limit(1)).valueChanges()
  }*/

  /*getGameTeams(){
    return this.db.collection('Teams', ref => ref.where('id', 'in', [''] )).valueChanges()
  }*/

  getTestDoc(id) {
    // return this.db.collection('test').doc(id).collection('collection').valueChanges();
    return this.db.collection('test').doc(id).valueChanges();
  }
  updateTestDoc(id, data) {

    this.db.collection('test').doc(id).update({array: FieldValue.arrayRemove(data)})

    this.db.collection('test').doc(id).update({array: FieldValue.arrayUnion(data)})
  }
}
