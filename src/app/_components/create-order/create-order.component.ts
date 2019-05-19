import { Component, OnInit } from '@angular/core';
import { ToastService, FilesService, OrdersService } from 'src/app/_services';
import { FileModel, OrderModel, CreditCardModel } from 'src/app/_models';
import { TranslateService } from '@ngx-translate/core';
import { ModalController, NavParams } from '@ionic/angular';
import { Geolocation } from '@ionic-native/geolocation/ngx';

@Component({
  selector: 'app-create-order',
  templateUrl: './create-order.component.html',
  styleUrls: ['./create-order.component.scss'],
})
export class CreateOrderComponent implements OnInit {
  public files: FileModel[] = [];
  public order: OrderModel;
  public creditCard: CreditCardModel = new CreditCardModel();

  constructor(
    private toastService: ToastService,
    private filesService: FilesService,
    private ordersService: OrdersService,
    private translation: TranslateService,
    private modalController: ModalController,
    private navParams: NavParams,
    private geolocation: Geolocation,
  ) {}

  ngOnInit() {
    this.order = new OrderModel();
    if (!this.navParams.data.order) {
      this.ordersService.create().subscribe(order => {
        this.order = order;
      });
    } else {
      this.order = this.navParams.data.order;
      this.loadFiles();
    }
  }

  save() {
    this.modalController.dismiss();
  }

  close() {
    this.modalController.dismiss();
  }

  uploading() {
    return this.filesService.uploading;
  }

  openFile() {
    document.getElementById('fileUploader').click();
  }

  loadFiles() {
    this.filesService.getAll(this.order.id).subscribe(files => {
      this.files = files;
    });
  }

  uploadFiles(event: any) {
    const files = event.target.files;

    if (files.length === 0) {
      return;
    }

    for (const file of files) {
      this.filesService.uploadFile(this.order.id, file).subscribe(
        uploadedFile => {
          this.files.push(uploadedFile);
          this.toastService.show(`${this.translation.instant('File')} ${uploadedFile.filename} ${this.translation.instant('uploaded')}`);
        }
      );
    }

    event.target.value = '';
  }

  deleteFile(file: FileModel) {
    this.filesService.deleteFile(file).subscribe(() => {
      this.toastService.show(`${this.translation.instant('File')} ${file.filename} ${this.translation.instant('deleted')}`);
    }, (err) => {
      this.toastService.show(err);
    });
  }

  async getLocation() {
    const g = await this.geolocation.getCurrentPosition();

    this.order.lat = g.coords.latitude;
    this.order.lon = g.coords.longitude;
  }

  saveOrder() {
    this.order.status = 'pending';
    this.ordersService.put(this.order).subscribe(() => {
      this.toastService.show(this.translation.instant('Order will processed by manager and will invoice'));
    });
  }

  payOrder() {
    console.log(this.creditCard.name);
    if (!this.creditCard.checkCard()) {
      this.toastService.show(this.translation.instant('Enter your credit card details'));
      return;
    }

    this.order.status = 'payed';
    this.ordersService.put(this.order).subscribe(() => {
      this.toastService.show(this.translation.instant('Order payed successfuly.'));
    });
  }

}
