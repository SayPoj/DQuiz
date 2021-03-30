import {Component, OnInit} from '@angular/core';
import {RouteConfigLoadEnd, RouteConfigLoadStart, Router} from "@angular/router";
import {Title} from "@angular/platform-browser";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  loadingRouteConfig: boolean;

  showRecommendationCheckNetwork:boolean
  constructor (private title: Title,private router: Router) {
    title.setTitle( 'DQuiz');
  }
  ngOnInit () {
    this.router.events.subscribe(event => {
      if (event instanceof RouteConfigLoadStart) {
        this.loadingRouteConfig = true;
        setTimeout(()=>{
          this.showRecommendationCheckNetwork = true
        },3000)
      } else if (event instanceof RouteConfigLoadEnd) {
        this.loadingRouteConfig = false;
      }
    });

  }
}
