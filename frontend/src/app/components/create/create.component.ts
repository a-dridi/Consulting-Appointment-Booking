import { Component, OnInit } from '@angular/core';
import { AppointmentService } from '../../appointment.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AppComponent } from 'src/app/app.component';
import { AppSettings } from 'src/app/appsettings.model';


@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.css']
})
export class CreateComponent implements OnInit {
  public uiString: Map<String, String>;
  createForm: FormGroup;
  selectedHour: string;
  selectedMinute: string;
  timePlaceholder: String;
  datePlaceholder: String;
  namePlaceholder: String;
  descriptionPlaceholder: String;
  ratePlaceholder: String;

  public appsettings: AppSettings[] = [];
  public selectedCurrency: String; 

  constructor(private appointmentService: AppointmentService, private appointmentForm: FormBuilder, private router: Router, private snackBar: MatSnackBar) {
    this.loadAppSettings();
    this.uiString = AppComponent.uiStringFinal;
    this.timePlaceholder = this.uiString.get("createFormTImeoftheappointmentColumnPlaceholder");
    this.datePlaceholder = this.uiString.get("createFormDateoftheappointmentColumnPlaceholder");
    this.namePlaceholder = this.uiString.get("createFormNameColumnPlaceholder");
    this.descriptionPlaceholder = this.uiString.get("createFormDescriptionColumnPlaceholder");

    this.createForm = this.appointmentForm.group({
      date: [''],
      name: ['', Validators.required],
      description: [''],
      rate: ['']
    });
  }

  ngOnInit(): void {
  }

  addAppointment(date, name, description, rate) {
    //console.log(date);
    //Reformat date into us format - for given French date locale
    if (date != null && date !== "") {
      let dateParsed = new Date(date.split("/").reverse().join("/"));

      if (isNaN(dateParsed.getTime())) {
        date = Date.now;
      } else {
        //Set selected time by timepicker
        if (!isNaN(parseInt(this.selectedHour)) && !isNaN(parseInt(this.selectedHour))) {
          dateParsed.setHours(parseInt(this.selectedHour));
          dateParsed.setMinutes(parseInt(this.selectedMinute));
        }
        date = dateParsed.toString();
      }
    } else {
      date = Date.now;
    }

    //console.log("parsed: " + dateParsed.toString());

    if (rate != null && rate !== "") {
      let parsedRate = (parseFloat(rate));
      if (parsedRate >= 1) {
        this.appointmentService.addAppointment(date, name, description, parsedRate.toFixed(2), this.selectedCurrency).subscribe(() => {
          this.router.navigate(['/allappointments']);
        });
      } else {
        this.snackBar.open("" + this.uiString.get("createRateErrorSnackbar"), "OK", {
          duration: 4000
        });

      }
    } else {
      this.appointmentService.addAppointment(date, name, description, 1.00, this.selectedCurrency).subscribe(() => {
        this.router.navigate(['/allappointments']);
        this.snackBar.open("" + this.uiString.get("createSuccessSnackbar"), "OK", {
          duration: 4000
        });
      });
    }
  }

  updateTime(time: String) {
    if (time != null && time !== "") {
      let timeSplitted = time.split(":");
      this.selectedHour = timeSplitted[0];
      this.selectedMinute = timeSplitted[1];
    }
  }

  loadAppSettings() {
    this.appointmentService.getAllAppSettings()
      .subscribe((data: AppSettings[]) => {
          this.appsettings = data;
          this.setUsedSettings(data);
      })
  }

  setUsedSettings(appSettings){
    appSettings.forEach(element => {
      if(element.code === "defaultCurrency"){
        this.selectedCurrency = element.value;
      }
    });
    this.ratePlaceholder = this.uiString.get("createFormRateColumnPlaceholder").replace("_%_",""+this.selectedCurrency);

  }
  
  

}
