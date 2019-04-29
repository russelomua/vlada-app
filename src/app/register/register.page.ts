import { Component, OnInit } from '@angular/core';
import { AppConfig } from '../app.config';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {
  title: string;
  constructor(config: AppConfig) {
    this.title = config.name;
  }

  ngOnInit() {
  }

}
