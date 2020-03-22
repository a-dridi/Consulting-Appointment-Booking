import { Component } from '@angular/core';
import { AppointmentService } from './appointment.service';
import { AdminDataSharingService } from './admindatasharingservice';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'consultingappointmentbooking';
  adminLoggedIn: Boolean = false;
  constructor(private adminDataSharingService: AdminDataSharingService, private appointmentService: AppointmentService, private router: Router) {

    //LOAD admin toolbar links if admin is authenticated
    appointmentService.checkAdminAuthentication()
      .subscribe(
        data => {
          this.adminLoggedIn = true;
        },
        error => {
          this.adminLoggedIn = false;
        }
      )
    this.adminDataSharingService.adminLoggedIn.subscribe(value => {
      this.adminLoggedIn = value;
    });
  }

  showAdminAgentPage() {
    this.appointmentService.checkAdminAuthentication()
    .subscribe(
      data => {
        this.router.navigate(['/admin']);
      },
      error => {
        this.router.navigate(['/admin-login']);
      }
    )
  }

}
