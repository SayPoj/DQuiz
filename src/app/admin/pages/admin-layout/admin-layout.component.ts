import {Component} from '@angular/core';
import {Title} from "@angular/platform-browser";
import {AdminAuthService} from "../../services/admin-auth.service";

@Component({
  selector: 'app-admin-layout',
  templateUrl: './admin-layout.component.html',
  styleUrls: ['./admin-layout.component.scss']
})
export class AdminLayoutComponent {
  constructor(private titleService: Title, public adminAuthService: AdminAuthService) {
    titleService.setTitle('DQuiz | Admin');
  }
}
