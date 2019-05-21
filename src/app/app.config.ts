import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})

export class AppConfig {
    name = 'Typograph.io';
    // http://vlada.kharkov.ua/api/
    apiUrl = 'http://176.104.100.57/vlada-api/?';
}
