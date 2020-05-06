import { Component, OnInit } from '@angular/core';
import { AppointmentService } from '../../appointment.service';
import { Router, ActivatedRoute } from '@angular/router';
import {MatIconModule, MatIcon} from "@angular/material/icon";
import { AppComponent } from 'src/app/app.component';

@Component({
  selector: 'app-paymentsuccess',
  templateUrl: './paymentsuccess.component.html',
  styleUrls: ['./paymentsuccess.component.css']
})
export class PaymentsuccessComponent implements OnInit {
  public uiString: Map<String, String>;

  bookedappointment: any = {};

  constructor(private appointmentService: AppointmentService, private router: Router, private route: ActivatedRoute, private matIconModule: MatIconModule) {
    this.uiString = AppComponent.uiStringFinal;
  }

  ngOnInit(): void {
    //get id which is added after the uri "paymentsuccess" in the uri address
    let uriArray = (window.location.pathname).split("/");
    console.log(uriArray[2]);
    if ((typeof uriArray !== undefined) && uriArray != null && uriArray[2] != null)
      this.appointmentService.getBookedAppointmentById(uriArray[2]).subscribe(res => {
        this.bookedappointment = res;
      });
  }

}
