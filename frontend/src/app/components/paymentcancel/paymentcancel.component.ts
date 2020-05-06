import { Component, OnInit } from '@angular/core';
import { AppComponent } from 'src/app/app.component';

@Component({
  selector: 'app-paymentcancel',
  templateUrl: './paymentcancel.component.html',
  styleUrls: ['./paymentcancel.component.css']
})
export class PaymentcancelComponent implements OnInit {
  public uiString: Map<String, String>;

  constructor() { 
    this.uiString = AppComponent.uiStringFinal;
  }

  ngOnInit(): void {
  }

}
