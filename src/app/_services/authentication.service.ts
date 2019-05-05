import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { AppConfig } from '../app.config';
import { SessionModel } from '../_models';
import { LoginModel } from '../_models';
import { Router, ActivatedRoute } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
    private sessionSubject: BehaviorSubject<SessionModel>;
    public session: Observable<SessionModel>;

    private storageItemName = 'session';

    constructor(
        private http: HttpClient,
        private config: AppConfig,
        private route: ActivatedRoute,
        private router: Router,
    ) {
        this.sessionSubject = new BehaviorSubject<SessionModel>(JSON.parse(localStorage.getItem(this.storageItemName)));
        this.session = this.sessionSubject.asObservable();
    }

    public get sessionValue(): SessionModel {
        return this.sessionSubject.value;
    }

    login(loginForm: LoginModel) {
        return this.http.post<any>(`${this.config.apiUrl}login`, loginForm)
            .pipe(map(session => {
                // login successful if there's a jwt token in the response
                if (session && session.token) {
                    // store user details and jwt token in local storage to keep user logged in between page refreshes
                    localStorage.setItem(this.storageItemName, JSON.stringify(session));
                    this.sessionSubject.next(session);

                    this.route.queryParams.subscribe(params => {
                        console.log(params);
                        if (params.returnUrl) {
                            this.router.navigateByUrl(params.returnUrl);
                        } else {
                            this.router.navigate(['/']);
                        }
                    });
                }
                return session;
            }));
    }

    logout() {
        // remove user from local storage to log user out
        localStorage.removeItem(this.storageItemName);
        this.sessionSubject.next(null);

        this.router.navigate(['/login']);
    }
}
