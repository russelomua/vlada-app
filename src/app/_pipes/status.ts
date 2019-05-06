import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'statusPipe'})

export class StatusPipe implements PipeTransform {
  transform(value: string): string {
    const match = {
        uploading: 'Загрузка',
        pending: 'Ожидает печати',
        processing: 'В печати',
        delivering: 'Доставка',
        done: 'Доставлено'
    };
    return match[value];
  }
}