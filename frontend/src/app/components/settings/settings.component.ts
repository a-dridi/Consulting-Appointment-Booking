import { Component, OnInit } from '@angular/core';
import { AppointmentService } from 'src/app/appointment.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AppSettings } from 'src/app/appsettings.model';
import { AppComponent } from 'src/app/app.component';
import { Currencies } from 'src/app/util/currencies';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {
  public uiString: Map<String, String>;
  public appsettings: Map<String, String> = new Map<String, String>();
  public selectedCurrency: String;
  public currencies: String[];

  constructor(private appointmentService: AppointmentService, private router: Router, private snackBar: MatSnackBar) {
    this.uiString = AppComponent.uiStringFinal;

    this.loadAppSettings();
    this.currencies = Currencies.getCurrencies();
  }

  ngOnInit(): void {
  }

  /**
   * Load saved AppSettings. When the function is started for the first time, then settings are added with default values.
   */
  loadAppSettings() {
    this.appointmentService.getAllAppSettings()
      .subscribe((data: AppSettings[]) => {
        console.log("data loaded")
        data.forEach(dataItem => {
          this.appsettings.set(dataItem.code, dataItem.value);
        })
        this.loadSelectedSettings(this.appsettings);
      });
  }

  loadSelectedSettings(appSettings: Map<String, String>) {
    this.selectedCurrency = appSettings.get("defaultCurrency");
  }


  onCurrencySelectorChanged(event) {
    this.selectedCurrency = event;
  }

  updateSettings() {
    //Set currency
    this.appointmentService.editAppSetting("defaultCurrency", this.selectedCurrency).subscribe(() => {
      this.snackBar.open("" + this.uiString.get("settingsSuccessSnackbar"), "OK", {
        duration: 4000
      });
    }, err => {
      this.snackBar.open("" + this.uiString.get("settingsFailedSnackbar"), "OK", {
        duration: 4000
      });
    });
  }

}
