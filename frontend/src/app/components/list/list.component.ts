import { Component, OnInit } from '@angular/core';
import { AppointmentService } from '../../appointment.service';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';

import { Appointment } from '../../appointment.model';
import { AppComponent } from 'src/app/app.component';
import { AppSettings } from 'src/app/appsettings.model';


@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit {
  public uiString: Map<String, String>;
  public appsettings: AppSettings[] = [];
  public selectedCurrency: String;

  appointments: Appointment[];
  //Columns default for admin/agents
  appointmentColumns = ['date', 'name', 'description', 'rate', 'book', 'edit-delete'];

  adminUserAuthenticated: boolean = false;

  paymentSessionObject: String;

  constructor(private appointmentService: AppointmentService, private snackBar: MatSnackBar, private router: Router) {
    this.uiString = AppComponent.uiStringFinal;
    this.loadAppSettings();

    appointmentService.checkAdminAuthentication()
      .subscribe(
        data => {
          //LOAD add, edit and delete appointment buttons if admin is authenticated
          this.adminUserAuthenticated = true;
          this.appointmentColumns = ['date', 'name', 'description', 'rate', 'book', 'edit-delete'];
        },
        error => {
          this.adminUserAuthenticated = false
          this.appointmentColumns = ['date', 'name', 'description', 'rate', 'book'];
        }
      )
  }

  ngOnInit(): void {
    this.loadAppointments();
  }

  loadAppSettings() {
    this.appointmentService.getAllAppSettings()
      .subscribe((data: AppSettings[]) => {
        this.appsettings = data;
        this.setUsedSettings(data);
      })
  }

  setUsedSettings(appSettings) {
    appSettings.forEach(element => {
      if (element.code === "defaultCurrency") {
        this.selectedCurrency = element.value;
      }
    });
  }

  loadAppointments() {
    this.appointmentService
      .getAppointments()
      .subscribe((data: Appointment[]) => {
        this.appointments = data;
        console.log("Appointments data loaded");
        console.log(this.appointments);
      });
  }

  //Available for Admin user:
  editAppointment(id) {
    this.router.navigate([`/edit/${id}`]);
  }

  deleteAppointment(id) {
    this.appointmentService.deleteAppointment(id).subscribe(() => {
      this.loadAppointments();
      this.snackBar.open("" + this.uiString.get("listDeleteAppointmentSuccess"), "OK", {
        duration: 4000
      });
    });
  }


  //open booking page
  bookAppointment(id) {
    this.router.navigate([`/book/${id}`]);
  }

}
