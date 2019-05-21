import { Injectable } from '@angular/core';
import { ToastService } from './toast.service';
import { TranslateService } from '@ngx-translate/core';
import { Platform } from '@ionic/angular';
import { Subscription } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class DoubleBackService {
    constructor(
        private toastService: ToastService,
        private translate: TranslateService,
        private platform: Platform,
    ) {}

    subscription: Subscription;
    counter = 0;

    public subscribe() {
        this.subscription = this.platform.backButton.subscribe(() => {
            if (this.tryExit()) {
                navigator['app'].exitApp();
            }
        });
    }

    public unsubscribe() {
        this.subscription.unsubscribe();
    }

    public tryExit() {
        if (this.counter === 0) {
            this.counter++;
            this.toastService.show(this.translate.instant('Press back button again to exit'), 500);
            setTimeout(() => { this.counter = 0; }, 2000);
            return false;
        } else {
            return true;
        }
    }
}


