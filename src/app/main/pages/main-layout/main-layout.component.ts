import { Component, OnInit } from '@angular/core';


@Component({
  selector: 'app-main-layout',
  templateUrl: './main-layout.component.html',
  styleUrls: ['./main-layout.component.scss']
})
export class MainLayoutComponent{
  window= window;
  deviceWidth = (window.innerWidth > 0) ? window.innerWidth : screen.width

}
