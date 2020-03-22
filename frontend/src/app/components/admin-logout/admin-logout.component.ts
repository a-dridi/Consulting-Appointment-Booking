import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppointmentService } from 'src/app/appointment.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-admin-logout',
  templateUrl: './admin-logout.component.html',
  styleUrls: ['./admin-logout.component.css']
})

export class AdminLogoutComponent implements OnInit {

  constructor(private router: Router, private appointmentService: AppointmentService, private snackBar: MatSnackBar, private spinnerModule: MatProgressSpinnerModule) {
    this.appointmentService.doAdminLogout()
      .subscribe(
        data => {
          console.log("You are logged out now.");
          this.router.navigate(['/admin-login']);
          this.snackBar.open("You are logged out. ", "OK", {
            duration: 4000
          });
        },
        error => {
          this.snackBar.open("LOGOUT FAILED. ", "OK", {
            duration: 4000
          });
        }
      )
  }

  ngOnInit(): void {
  }

}
