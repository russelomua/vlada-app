import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { AuthenticationService } from '../_services';

@Injectable({ providedIn: 'root' })
export class LoginPageGuard implements CanActivate {
    constructor(
        private router: Router,
        private authenticationService: AuthenticationService
    ) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        const session = this.authenticationService.sessionValue;
        if (session) {
            // not logged in so redirect to login page with the return url
            if (route.queryParams.returnUrl) {
                this.router.navigateByUrl(route.queryParams.returnUrl);
            } else {
                this.router.navigate(['/']);
            }
            // logged in so return true
            return false;
        }

        return true;
    }
}
