import { Component, OnInit } from '@angular/core';
import { AppConfig } from '../app.config';
import { UserModel } from '../_models';
import { UserService, ToastService } from '../_services';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {
  title: string;

  user: UserModel = new UserModel();
  replyPassword: string;

  errors = {
    fill_all_fields: this.translate.instant('Fill all fields'),
    user_exist: this.translate.instant('User exist'),
  };

  constructor(
    public config: AppConfig,
    public users: UserService,
    public toast: ToastService,
    public translate: TranslateService,
  ) {
    this.title = config.name;
  }

  ngOnInit() {
  }

  register() {
    if (!this.user.checkUser()) {
      this.toast.show(this.errors.fill_all_fields);
      return;
    }

    if (this.replyPassword !== this.user.password) {
      this.toast.show(this.translate.instant('Passwords dosen\'t match'));
      return;
    }

    this.users.create(this.user).subscribe(
      createdUser => {
        this.toast.show(this.translate.instant(`User ${createdUser.login} successfuly created`));
        this.user = new UserModel();
      },
      error => {
        this.toast.show(this.errors[error]);
      }
    );
  }

}
