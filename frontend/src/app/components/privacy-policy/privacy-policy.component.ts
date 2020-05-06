import { Component, OnInit } from '@angular/core';
import { AppComponent } from 'src/app/app.component';

@Component({
  selector: 'app-privacy-policy',
  templateUrl: './privacy-policy.component.html',
  styleUrls: ['./privacy-policy.component.css']
})
export class PrivacyPolicyComponent implements OnInit {
  public uiString: Map<String, String>;

  constructor() { 
    this.uiString = AppComponent.uiStringFinal;
  }

  ngOnInit(): void {
  }

}
