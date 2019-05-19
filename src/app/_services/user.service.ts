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

    users: UserModel[] = [];

    getAll() {
        this.users = [];
        return this.http.get<UserModel[]>(`${this.config.apiUrl}files`).pipe(
            tap({
              next: users => {
                this.users = users;
              },
              error: () => {
                this.users = [];
              }
            })
        );
    }

    get(id: number) {
        return this.http.get<UserModel>(`${this.config.apiUrl}users/${id}`).pipe(
            tap(user => {
                const index = this.users.indexOf(user);
                if (index >= 0) {
                    this.users[index] = user;
                } else {
                    this.users.push(user);
                }
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
