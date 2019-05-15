import { Pipe, PipeTransform } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Pipe({name: 'orderStatus'})

export class StatusPipe implements PipeTransform {
  transform(value: string): string {
    // const match = {
    //     uploading: TranslateService.arguments('Uploading'),

    //     payment: TranslateService.arguments('Waiting for payment'),
    //     printing: TranslateService.arguments('Printing'),
    //     pending_delivery: TranslateService.arguments('Pending for delivering'),
    //     delivering: TranslateService.arguments('Delivering in progress'),
    //     done: TranslateService.arguments('Delivered'),
    //     new: TranslateService.arguments('New'),
    // };
    // return match[value];
    return '';
  }
}