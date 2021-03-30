import { Injectable } from '@angular/core';
import {CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router} from '@angular/router';
import { Observable } from 'rxjs';
import {AdminAuthService} from "./admin-auth.service";

@Injectable()

export class AdminAuthGuard implements CanActivate {
  constructor(private adminAuthServiceService: AdminAuthService, private router: Router) {}
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if (this.adminAuthServiceService.isAuth()){
      return true
    }else {
      this.adminAuthServiceService.logOut()
      this.router.navigate(['/admin', 'auth'])
    }

  }

}
