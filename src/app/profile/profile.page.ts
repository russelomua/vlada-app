import { Component, OnInit } from '@angular/core';
import { UserModel } from '../_models';
import { UserService, ToastService } from '../_services';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  user: UserModel = new UserModel();
  constructor(
    private userService: UserService,
    private toast: ToastService,
    private translate: TranslateService,
  ) { }

  ngOnInit() {
    this.userService.getCurrent().subscribe(user => {
      this.user = user;
    });
  }

  save() {
    this.userService.edit(this.user).subscribe(editedUser => {
      this.user = editedUser;
      this.toast.show(this.translate.instant('Profile modified'));
    }, error => {
      this.toast.show(this.translate.instant('Error while saving'));
    });
  }
}
