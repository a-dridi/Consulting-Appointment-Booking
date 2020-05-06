import { Component, OnInit } from '@angular/core';
import { AppComponent } from 'src/app/app.component';

@Component({
  selector: 'app-general-notice',
  templateUrl: './general-notice.component.html',
  styleUrls: ['./general-notice.component.css']
})
export class GeneralNoticeComponent implements OnInit {
  public uiString: Map<String, String>;

  constructor() { 
    this.uiString = AppComponent.uiStringFinal;
  }

  ngOnInit(): void {
  }

}
