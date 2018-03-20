import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { AuthService } from './auth.service';
import { Router, NavigationExtras } from '@angular/router';

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(public authService: AuthService, public router: Router) {}

  canLoad(): boolean {
   return this.checkLogin();
  }

  canActivate(): boolean{
   let allowed = this.checkLogin();

   if(!allowed)
       this.router.navigate(['/login']);

   return allowed;
  }



  checkLogin():boolean {
    return this.authService.admin!=null;
  }
}
