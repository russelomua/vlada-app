import { Component } from '@angular/core';
import { AppConfig } from '../app.config';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  title: string;
  constructor(config: AppConfig) {
    this.title = config.name;
  }
}
