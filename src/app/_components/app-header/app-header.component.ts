import { Component, OnInit } from '@angular/core';
import { AppConfig } from 'src/app/app.config';
import { AuthenticationService } from 'src/app/_services';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-header',
  templateUrl: './app-header.component.html',
  styleUrls: ['./app-header.component.scss'],
})
export class AppHeaderComponent implements OnInit {

  constructor(
    public config: AppConfig,
    public auth: AuthenticationService,
    public router: Router,
    private alertController: AlertController,
    private tranlsate: TranslateService,
  ) { }

  ngOnInit() {}

  isAtHome() {
    return this.router.isActive('home', false);
  }

  async confirmAlert() {
    const alert = await this.alertController.create({
      header: this.tranlsate.instant('Wooow!'),
      message: this.tranlsate.instant('Confirm signout'),
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        }, {
          text: 'Sing Out',
          handler: () => {
            this.auth.logout();
          }
        }
      ]
    });

    await alert.present();
  }

}
