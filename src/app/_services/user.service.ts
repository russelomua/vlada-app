import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { AppConfig } from '../app.config';
import { UserModel } from '../_models';
import { tap } from 'rxjs/operators';
import { ToastService } from './toast.service';

@Injectable({ providedIn: 'root' })
export class FilesService {
    constructor(
        private http: HttpClient,
        private config: AppConfig,
        private toast: ToastService,
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

    // create(user: UserModel) {
    //     return this.http.post<UserModel>(`${this.config.apiUrl}users`, user).pipe(
    //         tap({
    //             next: createdUser => {
    //                 this.users.push(createdUser);
    //             },
    //             error: () => {
    //                 this.toast.show('123');
    //             }
    //         })
    //     );
    // }
}
