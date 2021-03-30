import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router,} from '@angular/router';
import { Observable } from 'rxjs';
import {GameAuthService} from "./game-auth.service";

@Injectable({
  providedIn: 'root'
})

export class GameAuthGuard implements CanActivate {
  constructor(private gameAuthService: GameAuthService,
              private router: Router,
              ) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    let gameAuth = this.gameAuthService.getAuth()
    this.gameAuthService.setRedirectUrl(state.url)

    if (gameAuth && gameAuth.game.id==next.params.gameId && gameAuth.team.id == next.params.teamId
      && (gameAuth.authType && (this.gameAuthService.isRedirectUrlAnswerForm() && (gameAuth.authType == 'answer-form' || gameAuth.authType == 'game-layout')
        || (!this.gameAuthService.isRedirectUrlAnswerForm() && (gameAuth.authType == 'game-layout'))
      ))
    ){
      return true
    } else {
      if (!gameAuth || !gameAuth.game.id==next.params.gameId || !gameAuth.team.id == next.params.teamId) { this.gameAuthService.logOut() }
      this.router.navigate([ `/game/${next.params.gameId}/${next.params.teamId}/auth`], { queryParams: next.queryParams })
    }

  }

}
