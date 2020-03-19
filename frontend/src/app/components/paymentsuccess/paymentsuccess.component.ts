import { Component, OnInit } from '@angular/core';
import { AppointmentService } from '../../appointment.service';
import { Router, ActivatedRoute } from '@angular/router';
import {MatIconModule, MatIcon} from "@angular/material/icon";

@Component({
  selector: 'app-paymentsuccess',
  templateUrl: './paymentsuccess.component.html',
  styleUrls: ['./paymentsuccess.component.css']
})
export class PaymentsuccessComponent implements OnInit {

  bookedappointment: any = {};

  constructor(private appointmentService: AppointmentService, private router: Router, private route: ActivatedRoute, private matIconModule: MatIconModule) {
  }

  ngOnInit(): void {
    //get id which is positioneda after the uri "paymentsuccess" in the uri address
    let uriArray = (window.location.pathname).split("/");
    console.log(uriArray[2]);
    if ((typeof uriArray !== undefined) && uriArray != null && uriArray[2] != null)
      this.appointmentService.getBookedAppointmentById(uriArray[2]).subscribe(res => {
        this.bookedappointment = res;
      });
  }

}
