import { Injectable } from '@angular/core';
import {AngularFirestore} from "@angular/fire/firestore";
import {Router} from "@angular/router";

export interface adminUser {
  id: string;
  login: string;
}


@Injectable()
export class AdminAuthService {


  constructor( public router: Router,
               public afs: AngularFirestore) {}

  logIn(authData){

      this.afs.collection('Admins').doc(authData.login).valueChanges().subscribe(admin=>{
        if(admin){
          // @ts-ignore
          if(authData.password == admin.password){
            localStorage.setItem('adminUser', JSON.stringify(authData.login));
            JSON.parse(localStorage.getItem('adminUser'));
            this.router.navigate(['/admin'])
          }else{
            this.router.navigate(['/admin', 'auth'],{
              queryParams:{
                invalidPassword:true
              }
            })
          }
        }
        else {
          this.router.navigate(['/admin', 'auth'],{
            queryParams:{
              invalidLogin:true
            }
          })
        }
      })
  }

  logOut(){
    localStorage.removeItem('adminUser');
  }

  isAuth():boolean {
    return (JSON.parse(localStorage.getItem('adminUser')) !== null);
  }

  getAdminName(): string{
    return JSON.parse(localStorage.getItem('adminUser')) ;
  }
}
