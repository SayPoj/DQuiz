import { Component, OnInit } from '@angular/core';
import {get} from 'scriptjs'
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {AdminAuthService} from "../../services/admin-auth.service";
import {ActivatedRoute, Params, Router} from "@angular/router";

@Component({
  selector: 'app-admin-authorization',
  templateUrl: './admin-authorization.component.html',
})
export class AdminAuthorizationComponent implements OnInit {
  adminAuthorizationForm: FormGroup
  authMes;
  constructor(
    public adminAuthServiceService: AdminAuthService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    if(this.adminAuthServiceService.isAuth()){ this.router.navigate(['/admin'])}
    this.adminAuthorizationForm = new FormGroup({
      adminLogin: new FormControl('', Validators.required),
      adminPassword: new FormControl('', Validators.required)
    })
    this.activatedRoute.queryParams.subscribe((params: Params) => {
      if(params['invalidPassword']){
        this.adminAuthorizationForm.reset()
        this.authMes = 'Пароль не подошел'
      }
      if(params['invalidLogin']){
        this.adminAuthorizationForm.reset()
        this.authMes = 'Пользователь не найден'
      }
    })
  }

  ngAfterViewInit(): void {
    const q = document.getElementById('q')
    const s = window.screen;
    // @ts-ignore
    const w = (q.width = s.width);
    // @ts-ignore
    const h = (q.height = s.height);
    // @ts-ignore
    const ctx = q.getContext("2d");
    const p = Array(Math.floor(w / 10) + 1).fill(0);
    const random = (items) => items[Math.floor(Math.random() * items.length)];
    const hex = "0123456789ABCDEF".split("");

    setInterval(() => {
      ctx.fillStyle = "rgba(0,0,0,.05)";
      ctx.fillRect(0, 0, w, h);
      ctx.fillStyle = "#0f0";
      p.map((v, i) => {
        ctx.fillText(random(hex), i * 10, v);
        p[i] = v >= h || v > 50 + 10000 * Math.random() ? 0 : v + 10;
      });
    }, 1000 / 30);

  }

  submitAdminAuthorizationForm() {
    if(this.adminAuthorizationForm.invalid){return}

    this.adminAuthServiceService.logIn({
      login: this.adminAuthorizationForm.controls.adminLogin.value.toLowerCase(),
      password: this.adminAuthorizationForm.controls.adminPassword.value,
    })
  }
}
