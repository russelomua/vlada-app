import { Component, OnInit } from '@angular/core';
import { FileModel } from '../_models/file';

import { ToastService, FilesService, AuthenticationService, OrdersService } from '../_services';
import { AppConfig } from '../app.config';
import { ModalController } from '@ionic/angular';
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
  files: FileModel[] = [];

  constructor(
    public config: AppConfig,
    private toastService: ToastService,
    private ordersService: OrdersService,
    public auth: AuthenticationService,
    private modalController: ModalController,
    private translation: TranslateService,
  ) {}

  ngOnInit() {
    this.loadOrders();
  }

  async editOrder(order: OrderModel) {
    const modal = await this.modalController.create({
      component: CreateOrderComponent,
      componentProps: { order }
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
