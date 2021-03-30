import {AfterViewInit, Component} from '@angular/core';
import {Title} from "@angular/platform-browser";
import {FirebaseService} from "../../../shared/services/firebase.service";
import {Game} from "../../../shared/interfaces/game";
import {ActivatedRoute} from "@angular/router";
import {get} from 'scriptjs'

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss'],
})

export class HomePageComponent implements  AfterViewInit{

  nearestGame;
  deviceWidth = (window.innerWidth > 0) ? window.innerWidth : screen.width

  constructor(private title: Title,
              public firebaseService: FirebaseService,
              private activatedRoute: ActivatedRoute
  ) {
    this.title.setTitle( 'DQuiz')
    get('https://code.jquery.com/jquery-3.2.1.slim.min.js',()=>{
      get('https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.12.9/umd/popper.min.js',()=>{
        get('https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/js/bootstrap.min.js',()=>{
          // @ts-ignore
          $('.carousel').carousel('pause')
          document.getElementById('carousel').onmouseenter = ()=>{
            // @ts-ignore
            $('.carousel').carousel('pause')
          }
          document.getElementById('carousel').onmouseleave = ()=>{
            // @ts-ignore
            $('.carousel').carousel('cycle')
          }
          /*this.firebaseService.getNearestGame().subscribe(game =>{
            this.nearestGame = game[0]
            // @ts-ignore
            $('.carousel').carousel({
              interval: 5000
            })
          })*/
        })
      })
    })

  }

  ngAfterViewInit(): void {
    /*this.activatedRoute.fragment.subscribe(params => {

      if (params == 'nearestGame'){
        // @ts-ignore
        $('.carousel').carousel(0)
        return  document.getElementById('carousel').scrollIntoView({ behavior: 'smooth'})
      }

      if(params){
        return document.getElementById(params).scrollIntoView({ behavior: 'smooth'})
      }

    })*/
    }

}
