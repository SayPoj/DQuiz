import { Injectable } from '@angular/core';
import {Router} from "@angular/router";

@Injectable({
  providedIn: 'root'
})
export class GameAuthService {

  redirectUrl: string

  constructor(private router: Router) {}

  isRedirectUrl():boolean {
    return (JSON.parse(localStorage.getItem('redirectUrl')) !== null);
  }

  setRedirectUrl(url){
    url = ''+url
    url = url.split('?')[0];
    /*console.log(url)*/
    localStorage.setItem('redirectUrl', JSON.stringify(url));
  }

  getRedirectUrl(){
    return JSON.parse(localStorage.getItem('redirectUrl'))
  }

  isRedirectUrlAnswerForm(){
    return (''+JSON.parse(localStorage.getItem('redirectUrl'))).includes('answer-form')
  }

  logIn(authData){
    localStorage.setItem('gameAuth', JSON.stringify(authData));
    if(this.isRedirectUrl()){
      this.router.navigate([''+this.getRedirectUrl()])
      // localStorage.removeItem('redirectUrl');
    } else {
      this.router.navigate([`/game/${authData.game.id}/${authData.team.id}`])
    }
  }


  logOut(){
    localStorage.removeItem('gameAuth');
  }

  isAuth():boolean {
    return (JSON.parse(localStorage.getItem('gameAuth')) !== null);
  }

  getAuth(){
    return JSON.parse(localStorage.getItem('gameAuth'))
  }
}
