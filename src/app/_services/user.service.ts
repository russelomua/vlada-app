import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { AppConfig } from '../app.config';
import { UserModel } from '../_models';
import { tap } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class UserService {
    constructor(
        private http: HttpClient,
        private config: AppConfig,
        private router: Router,
    ) {}

    user: UserModel;

    getCurrent() {
        return this.http.get<UserModel>(`${this.config.apiUrl}users`).pipe(
            tap({
              next: user => {
                this.user = user;
              },
              error: () => {
                this.user = new UserModel();
              }
            })
        );
    }

    edit(user: UserModel) {
        return this.http.put<UserModel>(`${this.config.apiUrl}users`, user).pipe(
            tap({
              next: editedUser => {
                this.user = editedUser;
              },
              error: () => {}
            })
        );
    }

    create(user: UserModel) {
        return this.http.post<UserModel>(`${this.config.apiUrl}users`, user).pipe(
            tap({
                next: () => {
                    this.router.navigate(['/login']);
                }
            })
        );
    }
}
