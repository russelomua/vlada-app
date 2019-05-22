import { Component, OnInit } from '@angular/core';
import { ToastService, FilesService, OrdersService } from 'src/app/_services';
import { FileModel, OrderModel, CreditCardModel, DronModel } from 'src/app/_models';
import { TranslateService } from '@ngx-translate/core';
import { ModalController, NavParams } from '@ionic/angular';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { tileLayer, latLng, LatLng, marker, icon, Map, polyline, Marker } from 'leaflet';
import { Subject, interval, timer, Subscription } from 'rxjs';
import { filter, throttleTime } from 'rxjs/operators';

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

  mapOffice: LatLng;

  mapDron: LatLng;
  mapDronMarker: Marker;

  mapCenter: LatLng;
  mapEvent = new Subject<LatLng>();
  orderDron: DronModel;

  dronProgress: Subscription;

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

    if (this.mapVisible()) {
      this.getLocation();

      if (this.order.status === 'delivering') {
        this.mapShowOffice();
        this.loadDron();
      }

      interval(1).subscribe(() => {
        this.map.invalidateSize();
      });
    }
  }

  close() {
    this.modalController.dismiss();
    if (typeof this.dronProgress !== 'undefined') {
      this.dronProgress.unsubscribe();
    }
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
        iconSize: [ 18, 29 ], // iconSize: [ 25, 41 ],
        iconAnchor: [ 9, 29 ], // iconAnchor: [ 13, 41 ],
        iconUrl: 'assets/leaflet/marker-icon.png',
        shadowUrl: 'assets/leaflet/marker-shadow.png'
      })
    });
    this.mapLayers[0] = layer;
  }

  onMapReady(map: Map) {
    this.map = map;

    this.mapEvent.pipe(
      throttleTime(50),
      filter(() => {
        if (this.order.status === 'enter_location') {
          return true;
        }
        return false;
      }),
    )
    .subscribe(coord => {
      this.updateMapPoint(coord);
    });
  }

  clickEvent(event: any) {
    this.mapEvent.next(event.latlng);
  }

  mapVisible() {
    return (this.order.status === 'enter_location' || this.order.status === 'pending_delivery' || this.order.status === 'delivering');
  }

  mapShowOffice() {
    this.ordersService.getOffice().subscribe(coords => {
      this.mapOffice = latLng(coords);

      const layer = marker(this.mapOffice, {
        icon: icon({
          iconSize: [ 18, 29 ],
          iconAnchor: [ 9, 29 ],
          iconUrl: 'assets/leaflet/marker-icon.png',
          shadowUrl: 'assets/leaflet/marker-shadow.png'
        })
      });
      this.mapLayers[1] = layer;

      const line = polyline([this.mapOffice, this.mapPoint]);
      this.mapLayers[2] = line;
    });
  }

  loadDron() {
    this.ordersService.getDelivery(this.order).subscribe(dron => {
      this.orderDron = dron;
      const date = new Date(this.orderDron.start);
      if (date.getTime() >= date.getTime()) {
        this.mapDron = this.getCoordWithProgress();
        this.addDron();
        this.dronProgress = this.startDron();
      }
    });
  }

  addDron() {
    this.mapDronMarker = marker([0, 0], {
      icon: icon({
        iconSize: [ 48, 41 ],
        iconAnchor: [ 24, 41 ],
        iconUrl: 'assets/dron-icon.png',
        shadowUrl: 'assets/leaflet/marker-shadow.png'
      })
    });
    this.mapLayers[3] = this.mapDronMarker;
  }

  removeDron() {
    this.mapLayers.splice(3);
  }

  startDron() {
    return timer(1000, 1000).subscribe({
      next: () => {
        this.mapDronMarker.setLatLng(this.getCoordWithProgress());
      },
      complete: () => {
        this.removeDron();
      }
    });
  }

  getCoordWithProgress() {
    const start = this.mapOffice; // start
    const finish = this.mapPoint; // end
    const progress = this.getProgress(this.orderDron);

    if (progress === 0) {
      return start;
    }
    return latLng(
      (finish.lat - start.lat) * progress + start.lat,
      (finish.lng - start.lng) * progress + start.lng
    );
  }

  getProgress(dron: DronModel) {
    let now = new Date().getTime();
    const start = new Date(dron.start).getTime();
    let finish = new Date(dron.finish).getTime();

    finish -= start;
    now -= start;

    const progress = now / finish;

    if (progress > 1) {
      return 1;
    }
    if (progress < 0 ) {
      return 0;
    }
    return progress;
  }

}
