import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AppointmentService } from './appointment.service';

@Injectable({
  providedIn: 'root'
})
export class AdminSectionGuardGuard implements CanActivate {
  appointmentService: AppointmentService;

  constructor(appointmentService: AppointmentService, private router: Router) {

  }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.appointmentService.checkAdminAuthentication().toPromise().then((data) => {
      return true;
    }).catch((err) => {
      this.router.navigate(['/admin-login']);
      return false;
    });
  }

}
