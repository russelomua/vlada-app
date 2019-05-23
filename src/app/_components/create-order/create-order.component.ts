import { Component, OnInit } from '@angular/core';
import { ToastService, FilesService, OrdersService } from 'src/app/_services';
import { FileModel, OrderModel, CreditCardModel, DronModel } from 'src/app/_models';
import { TranslateService } from '@ngx-translate/core';
import { ModalController, NavParams } from '@ionic/angular';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { tileLayer, latLng, LatLng, marker, icon, Map, polyline, Marker, map, latLngBounds, LatLngBounds } from 'leaflet';
import { Subject, interval, timer, Subscription } from 'rxjs';
import { filter, throttleTime, takeWhile } from 'rxjs/operators';
import { BoundText } from '@angular/compiler/src/render3/r3_ast';

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
  mapLayers: Marker[] = [];
  mapPoint: LatLng;
  mapPointMarker: Marker;

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
    if (this.order.lat && this.order.lon) {
      this.mapCenter = latLng(this.order.lat, this.order.lon);
      this.updateMapPoint(this.mapCenter);
    } else {
      this.geolocation.getCurrentPosition().then((g) => {
        this.mapCenter = latLng(g.coords.latitude, g.coords.longitude);
        this.updateMapPoint(this.mapCenter);
      }).catch(() => {
        this.mapCenter = latLng(this.options.center);
        this.updateMapPoint(this.mapCenter);
      });
    }
    this.zoomMarkers();
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

    if (typeof this.mapPointMarker === 'undefined') {
      this.mapPointMarker = marker(this.mapPoint, {
        icon: icon({
          iconSize: [ 18, 29 ], // iconSize: [ 25, 41 ],
          iconAnchor: [ 9, 29 ], // iconAnchor: [ 13, 41 ],
          iconUrl: 'assets/leaflet/marker-icon.png',
          shadowUrl: 'assets/leaflet/marker-shadow.png'
        })
      });
      this.mapLayers.push(this.mapPointMarker);
    }
    this.mapPointMarker.setLatLng(this.mapPoint);
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
      this.mapLayers.push(layer);
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
    if (typeof this.mapDronMarker === 'undefined') {
      this.mapDronMarker = marker([0, 0], {
        icon: icon({
          iconSize: [ 48, 41 ],
          iconAnchor: [ 24, 41 ],
          iconUrl: 'assets/dron-icon.png',
          shadowUrl: 'assets/leaflet/marker-shadow.png'
        })
      });
      this.mapDronMarker.setLatLng(this.options.center);
      this.mapLayers.push(this.mapDronMarker);
    }
  }

  removeDron() {
    const dronIndex = this.mapLayers.indexOf(this.mapDronMarker);
    if (dronIndex >= 0) {
      this.mapLayers.splice(dronIndex);
    }
  }

  startDron() {
    this.zoomMarkers();
    return timer(1000, 1000).pipe(takeWhile(() => {
      if (this.mapPoint.equals(this.getCoordWithProgress())) {
        this.removeDron();
        this.toastService.show(this.translation.instant('Delivered. Catch your order'), 6000);
        return false;
      }
      return true;
    })).subscribe({
      next: () => {
        const dron = this.getCoordWithProgress();
        this.mapDronMarker.setLatLng(dron);
      }
    });
  }

  zoomMarkers() {
    const bound = new LatLngBounds(this.options.center, this.options.center);
    for (const marker of this.mapLayers) {
      bound.extend(
        marker.getLatLng()
      );
    }
    if (typeof this.map !== 'undefined') {
      this.map.fitBounds(bound);
    }
  }

  getCoordWithProgress() {
    if (typeof this.mapOffice === 'undefined') {
      return this.mapPoint;
    }
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
