import { Component, OnInit, Input } from '@angular/core';
import { ToastService, FilesService, OrdersService } from 'src/app/_services';
import { FileModel, OrderModel } from 'src/app/_models';
import { TranslateService } from '@ngx-translate/core';
import { ModalController, NavParams } from '@ionic/angular';

@Component({
  selector: 'app-create-order',
  templateUrl: './create-order.component.html',
  styleUrls: ['./create-order.component.scss'],
})
export class CreateOrderComponent implements OnInit {
  files: FileModel[] = [];
  order: OrderModel = {};

  constructor(
    private toastService: ToastService,
    private filesService: FilesService,
    private ordersService: OrdersService,
    private translation: TranslateService,
    private modalController: ModalController,
    private navParams: NavParams,
  ) {
    if (!navParams.data.order) {
      this.ordersService.create().subscribe(order => {
        this.order = order;
      });
    } else {
      this.order = navParams.data.order;
      this.loadFiles();
    }
  }

  ngOnInit() { }

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

  uploadFiles(event) {
    const files = event.target.files;

    if (files.length === 0) {
      return;
    }

    for (const file of files) {
      this.filesService.uploadFile(this.order.id, file).subscribe(
        uploadedFile => {
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

}
