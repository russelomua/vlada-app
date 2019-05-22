import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { AppConfig } from '../app.config';
import { FileModel, OrderModel, DronModel } from '../_models';
import { tap, catchError } from 'rxjs/operators';
import { ToastService } from './toast.service';
import { uploadProgress, uploadResult } from '../_helpers/uploading';

@Injectable({ providedIn: 'root' })
export class OrdersService {
    constructor(
        private http: HttpClient,
        private config: AppConfig,
        private toast: ToastService,
    ) {}

    orderModel: OrderModel = {};
    orders: OrderModel[] = [];

    getAll() {
        this.orders = [];
        return this.http.get<OrderModel[]>(`${this.config.apiUrl}orders`).pipe(
            tap({
              next: orders => {
                this.orders = orders;
              },
              error: () => {
                this.orders = [];
              }
            })
        );
    }

    put(order: OrderModel) {
        return this.http.put<OrderModel>(`${this.config.apiUrl}orders/${order.id}`, order).pipe(
            tap(newOrder => {
                const index = this.orders.indexOf(order);
                if (index >= 0) {
                    this.orders[index] = newOrder;
                }
            })
        );
    }

    delete(order: OrderModel) {
        return this.http.delete<any>(`${this.config.apiUrl}orders/${order.id}`).pipe(
            tap(() => {
                const index = this.orders.indexOf(order);
                if (index >= 0) {
                    this.orders.splice(index, 1);
                }
            })
        );
    }

    create() {
        return this.http.post<OrderModel>(`${this.config.apiUrl}orders`, []).pipe(
            tap(order => {
                this.orders.push(order);
            })
        );
    }

    getOffice() {
        return this.http.get<[number, number]>(`${this.config.apiUrl}office`);
    }

    getDelivery(order: OrderModel) {
        return this.http.get<DronModel>(`${this.config.apiUrl}orders/${order.id}/delivery`);
    }
}
