import { Component, OnInit } from '@angular/core';
import { AppointmentService } from 'src/app/appointment.service';
import { Router } from '@angular/router';
import { BookedAppointment } from '../../bookedappointment.model'
import { BookedAppointmentView } from 'src/app/bookedappointmentview.model';
import { Client } from 'src/app/client.model';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {

  username: String = '';
  noBookedAppointments: Boolean = true;
  bookedAppointment: BookedAppointment[];
  bookedAppointmentClients: BookedAppointmentView[] = [];
  bookedAppointmentClientsToday: BookedAppointmentView[] = [];
  bookedAppointmentClientsColumn = ['date', 'clientname', 'clientemail', 'clienttelephone', 'name', 'description', 'rate', 'delete'];
  elementClient: any = {};
  constructor(private appointmentService: AppointmentService, private router: Router, private snackBar: MatSnackBar) {
    appointmentService.checkAdminAuthentication()
      .subscribe(
        data => {
          //LOAD THIS PAGE if admin is authenticated
          this.loadUsername();
          this.loadBookedAppointmentsToday();
          this.loadBookedAppointments();
        },
        error => {
          this.router.navigate(['/admin-login']);
        }
      )

  }

  ngOnInit(): void {

  }

  loadUsername() {
    this.username = this.appointmentService.adminName;
  }

  /**
   * Load booked appointments with client info
   */

  loadBookedAppointments() {
    this.appointmentService
      .getBookedAppointmentsClients()
      .subscribe((data: BookedAppointmentView[]) => {
        this.bookedAppointmentClients = data;
        if (this.bookedAppointmentClients.length > 0) {
          this.noBookedAppointments = false;
        }
      })
  }

  /**
   * Load for today booked appointments with client info
   */
  loadBookedAppointmentsToday() {
    this.appointmentService
      .getBookedAppointmentsClientsToday()
      .subscribe((data: BookedAppointmentView[]) => {
        this.bookedAppointmentClientsToday = data;
      })
  }

  deleteBookedAppointment(id) {
    this.appointmentService.deleteBookedAppointment(id).subscribe(() => {
      this.loadBookedAppointments();
      this.snackBar.open("Booked Appointment was deleted successfully!", "OK", {
        duration: 4000
      });
    });
  }

}
