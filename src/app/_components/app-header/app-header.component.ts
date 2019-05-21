import { Component, OnInit } from '@angular/core';
import { AppConfig } from 'src/app/app.config';
import { AuthenticationService } from 'src/app/_services';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './app-header.component.html',
  styleUrls: ['./app-header.component.scss'],
})
export class AppHeaderComponent implements OnInit {

  constructor(
    public config: AppConfig,
    public auth: AuthenticationService,
    public router: Router,
  ) { }

  ngOnInit() {}

  isAtHome() {
    return this.router.isActive('home', false);
  }

}
