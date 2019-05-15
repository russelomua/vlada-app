import { Component } from '@angular/core';
import { AppConfig } from '../app.config';

import { LoginModel } from '../_models';
import { AuthenticationService, ToastService } from '../_services';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-login',
  templateUrl: 'login.page.html',
  styleUrls: ['login.page.scss'],
})
export class LoginPage {
  title: string;
  loginForm: LoginModel = {login: '', password: ''};

  constructor(
    config: AppConfig,
    private auth: AuthenticationService,
    private toast: ToastService,
    public translate: TranslateService,
  ) {
    this.title = config.name;
  }

  login() {
    this.auth.login(this.loginForm).subscribe(_ => {
      this.loginForm.login = '';
      this.loginForm.password = '';
    }, error => {
      this.toast.show(error);
    });
  }
}
