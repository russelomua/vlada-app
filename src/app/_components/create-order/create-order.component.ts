import { Component, OnInit } from '@angular/core';
import { ToastService, FilesService, OrdersService } from 'src/app/_services';
import { FileModel, OrderModel, CreditCardModel } from 'src/app/_models';
import { TranslateService } from '@ngx-translate/core';
import { ModalController, NavParams } from '@ionic/angular';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { tileLayer, latLng, LatLng, marker, icon, Map } from 'leaflet';
import { Subject, interval } from 'rxjs';
import { filter, throttleTime, timeout, tap } from 'rxjs/operators';
import { last } from '@angular/router/src/utils/collection';

@Component({
  selector: 'app-create-order',
  templateUrl: './create-order.component.html',
  styleUrls: ['./create-order.component.scss'],
})
export class CreateOrderComponent implements OnInit {
  public files: FileModel[] = [];
  public order: OrderModel;
  public creditCard: CreditCardModel = new CreditCardModel();

  public options = {
    layers: [
      tileLayer(
        'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
        {
          maxZoom: 18,
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        })
    ],
    zoom: 10,
    center: latLng(49.9884043, 36.2328028)
  };
  MOVE_EVENT = 'mapMove';

  map: Map;
  mapLayers: any[] = [];
  mapPoint: LatLng;
  mapCenter: LatLng;
  mapEvent = new Subject<LatLng>();

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

    if (this.order.status === 'enter_location') {
      this.getLocation();

      interval(1).subscribe(() => {
        this.map.invalidateSize();
      });
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

    this.mapCenter = latLng(g.coords.latitude, g.coords.longitude);
    this.updateMapPoint(this.mapCenter);
  }

  deleteOrder() {
    this.ordersService.delete(this.order).subscribe(() => {
      this.toastService.show(this.translation.instant('Order canceled'));
      this.close();
    });
  }

  saveOrder() {
    this.order.status = 'pending';
    this.ordersService.put(this.order).subscribe(() => {
      this.toastService.show(this.translation.instant('Order will processed by manager and will invoice'));
      this.close();
    });
  }

  payOrder() {
    if (!this.creditCard.checkCard()) {
      this.toastService.show(this.translation.instant('Enter your credit card details'));
      return;
    }

    this.order.status = 'payed';
    this.ordersService.put(this.order).subscribe(() => {
      this.toastService.show(this.translation.instant('Order payed successfuly'));
      this.close();
    });
  }

  deliverOrder() {
    this.order.status = 'pending_delivery';
    this.ordersService.put(this.order).subscribe(() => {
      this.toastService.show(this.translation.instant('Wait for delivering'));
      this.close();
    });
  }

  // map
  updateMapPoint(point?: LatLng) {
    if (typeof point === 'undefined') {
      point = this.map.getCenter();
    }
    this.mapPoint = point;
    this.order.lat = this.mapPoint.lat;
    this.order.lon = this.mapPoint.lng;

    const layer = marker(this.mapPoint, {
      icon: icon({
        iconSize: [ 25, 41 ],
        iconAnchor: [ 13, 41 ],
        iconUrl: 'assets/leaflet/marker-icon.png',
        shadowUrl: 'assets/leaflet/marker-shadow.png'
      })
    });
    this.mapLayers[0] = layer;
  }

  onMapReady(map: Map) {
    this.map = map;

    this.mapEvent.pipe(
      throttleTime(50)
    )
    .subscribe(coord => {
      this.updateMapPoint(coord);
    });
  }

  clickEvent(event: any) {
    this.mapEvent.next(event.latlng);
  }

}
