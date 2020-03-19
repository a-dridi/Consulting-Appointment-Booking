import { Component, OnInit } from '@angular/core';
import { AppointmentService } from '../../appointment.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-processpayment',
  templateUrl: './processpayment.component.html',
  styleUrls: ['./processpayment.component.css']
})
export class ProcesspaymentComponent implements OnInit {


  constructor(private appointmentService: AppointmentService, private router: Router) {
    this.doPayment();
  }

  ngOnInit(): void {
  }


  /**
   * Execute Paypal payment process and do actual appointment booking if payment was successfull
   */
  doPayment() {
    //Parse uri from standard format "?desc=value&desc2=value" to Angular app format "/desc/desc2" to be used with $
    //Only the value from the key and value uri are passed
    //uriArray save uris in arrays (key and value in one array index - splitted by &) 
    //In xxxIdKeyValueArray: Key of a uri item in index 0 and value of a uri item in index 1
    let uriArray = (window.location.search).split("&");
    let paymentIdKeyValueArray = uriArray[0].split("=");
    let tokenKeyValueArray = uriArray[1].split("=");
    let payeridKeyValueArray = uriArray[2].split("=");
    this.appointmentService.processPayment(paymentIdKeyValueArray[1], tokenKeyValueArray[1], payeridKeyValueArray[1]).subscribe(
      res => {
        this.router.navigate([`/paymentsuccess/${res}`]);
      },
      err => {
        this.router.navigate(['/paymentcancel']);
      }
    );
  }

}
