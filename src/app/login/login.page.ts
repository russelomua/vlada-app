import { Component, OnInit } from '@angular/core';
import { AppConfig } from '../app.config';

import { LoginModel } from '../_models';
import { AuthenticationService, ToastService, DoubleBackService } from '../_services';
import { TranslateService } from '@ngx-translate/core';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-login',
  templateUrl: 'login.page.html',
  styleUrls: ['login.page.scss'],
})
export class LoginPage implements OnInit {
  title: string;
  loginForm: LoginModel = {login: '', password: ''};

  constructor(
    config: AppConfig,
    private auth: AuthenticationService,
    private toast: ToastService,
    public translate: TranslateService,
    private doubleBack: DoubleBackService,
  ) {
    this.title = config.name;
  }

  ngOnInit() {}

  ionViewDidEnter() {
    this.doubleBack.subscribe();
  }

  ionViewWillLeave() {
    this.doubleBack.unsubscribe();
  }

  login() {
    this.auth.login(this.loginForm).subscribe(_ => {
      this.loginForm.login = '';
      this.loginForm.password = '';
    }, error => {
      error = (error instanceof HttpErrorResponse ? this.translate.instant('Server offline') : error);
      this.toast.show(error);
    });
  }
}
