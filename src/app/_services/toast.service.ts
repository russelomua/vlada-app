import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';

@Injectable({
    providedIn: 'root'
})
export class ToastService {
    constructor(private toastController: ToastController) {}

    async show(message: string, duration?: number) {
        duration = (duration ? duration : 2000);
        const toast = await this.toastController.create({
            message,
            duration,
            translucent: true,
        });

        toast.present();
    }
}
