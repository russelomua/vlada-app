import { Component, OnInit } from '@angular/core';
import { ModalController, Platform } from '@ionic/angular';

import { AppConfig } from '../app.config';
import { ToastService, AuthenticationService, OrdersService, DoubleBackService } from '../_services';
import { CreateOrderComponent } from '../_components';
import { OrderModel } from '../_models';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  entryComponents: [ CreateOrderComponent ],
})
export class HomePage implements OnInit {
  constructor(
    public config: AppConfig,
    private toastService: ToastService,
    private ordersService: OrdersService,
    public auth: AuthenticationService,
    private modalController: ModalController,
    private translation: TranslateService,
    private doubleBack: DoubleBackService,
  ) {}

  ionViewDidEnter() {
    this.doubleBack.subscribe();
  }

  ionViewWillLeave() {
    this.doubleBack.unsubscribe();
  }

  ngOnInit() {
    this.loadOrders();
  }

  async editOrder(order?: OrderModel) {
    // order = (order ? order : new OrderModel());
    this.doubleBack.unsubscribe();
    const modal = await this.modalController.create({
      component: CreateOrderComponent,
      componentProps: { order }
    });

    modal.onDidDismiss().finally(() => {
      this.doubleBack.subscribe();
    });

    return await modal.present();
  }

  loadOrders() {
    this.ordersService.getAll().subscribe();
  }

  getOrders() {
    return this.ordersService.orders;
  }

  refreshOrders(event: any) {
    this.ordersService.getAll().subscribe(() => {
      event.target.complete();
    }, () => {
      event.target.error();
    });
  }

  deleteOrder(order: OrderModel) {
    this.ordersService.delete(order).subscribe(() => {
      this.toastService.show(this.translation.instant('Order deleted'));
    }, (err) => {
      this.toastService.show(err);
    });
  }

}
