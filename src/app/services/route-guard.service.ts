import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { AuthService } from './auth.service';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { SnackbarService } from './snackbar.service';
import { jwtDecode } from "jwt-decode";
import { GlobalConstants } from '../shared/global-constants';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class RouteGuardService {

  constructor(public auth: AuthService,
    public router: Router,
    private snackBar: SnackbarService,
    @Inject(PLATFORM_ID) private platformId: Object) { }

  canActivate(route: ActivatedRouteSnapshot): boolean {
    if (isPlatformBrowser(this.platformId)) {
      let expectedRoleArray: any = route.data;
      expectedRoleArray = expectedRoleArray.expectedRole;

      const token: any = localStorage.getItem('token');
      var tokenPayload: any;
      try {
        tokenPayload = jwtDecode(token);
      }
      catch (err) {
        localStorage.clear();
        this.router.navigate(['/']);
      }

      let expectedRole = '';

      for (let i = 0; i < expectedRoleArray.length; i++) {
        if (expectedRoleArray[i] == tokenPayload.role) {
          expectedRole = tokenPayload.role;
        }
      }

      if (tokenPayload.role == 'user' || tokenPayload.role == 'admin') {
        if (this.auth.isAuthenticated() && tokenPayload.role == expectedRole) {
          return true;
        }
        this.snackBar.openSnackBar(GlobalConstants.unauthorized, GlobalConstants.error);
        this.router.navigate(['/cafe/dashboard']);
        return false;
      } else {
        this.router.navigate(['/']);
        localStorage.clear();
        return false;
      }
    } else {
      console.error('Local storage is not available.');
      return false;
    }
  }
}
