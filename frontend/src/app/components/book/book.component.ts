import { Component, OnInit } from '@angular/core';
import { AppointmentService } from 'src/app/appointment.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Appointment } from 'src/app/appointment.model';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AppComponent } from 'src/app/app.component';
import { AppSettings } from 'src/app/appsettings.model';

@Component({
  selector: 'app-book',
  templateUrl: './book.component.html',
  styleUrls: ['./book.component.css']
})
export class BookComponent implements OnInit {
  public uiString: Map<String, String>;
  selectedId: String;
  selectedDate; String;
  selectedName: String;
  selectedDescription: String;
  selectedRate: String;
  loading: Boolean;
  bookButtonAlt: String;
  activeClientId: String;
  selectedAppointment: any = {};

  public appsettings: AppSettings[] = [];
  public selectedCurrency: String;

  constructor(private appointmentService: AppointmentService, private router: Router, private route: ActivatedRoute, private spinnerModule: MatProgressSpinnerModule) {
    this.uiString = AppComponent.uiStringFinal;
    this.bookButtonAlt = this.uiString.get("bookBookButtonAlt");
  }

  ngOnInit(): void {
    this.loading = false;
    this.route.params.subscribe(params => {
      this.selectedId = params.id;
      this.appointmentService.getAppointmentById(params.id).subscribe(res => {
        this.selectedAppointment = res;
       // let dateParsed = new Date(this.selectedAppointment.date);
        this.selectedDate = this.selectedAppointment.date;
        this.selectedName = this.selectedAppointment.name;
        this.selectedDescription = this.selectedAppointment.description;
        this.selectedRate = this.selectedAppointment.rate;
        this.selectedCurrency = this.selectedAppointment.currency;
      })
    })

  }

  //Book and Pay
  bookAndPayAppointment() {
    this.loading = true;
    this.appointmentService.bookAppointment(this.selectedId, this.selectedDate, this.selectedName, this.selectedDescription, this.selectedRate, this. selectedCurrency, this.activeClientId).subscribe(url => {
      window.location.href = "" + url;
    });
  }


}
