import { Component, OnInit } from '@angular/core';
import { AppointmentService } from '../../appointment.service';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Appointment } from '../../appointment.model';
import { AppComponent } from 'src/app/app.component';
import { AppSettings } from 'src/app/appsettings.model';


@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})
export class EditComponent implements OnInit {
  public uiString: Map<String, String>;

  //Appointment ID created by DB (MongoDB)
  id: String;
  appointment: any = {};
  selectedHour: string;
  selectedMinute: string;
  updateForm: FormGroup;
  selectedTime: string;
  timePlaceholder: String;
  datePlaceholder: String;
  namePlaceholder: String;
  descriptionPlaceholder: String;
  ratePlaceholder: String;

  public appsettings: AppSettings[] = [];
  public selectedCurrency: String;

  constructor(private appointmentService: AppointmentService, private router: Router, private route: ActivatedRoute, private snackBar: MatSnackBar, private appointmentForm: FormBuilder) {
    this.uiString = AppComponent.uiStringFinal;
    this.loadAppSettings();
    this.timePlaceholder = this.uiString.get("editFormTimeoftheappointmentColumnPlaceholder");
    this.datePlaceholder = this.uiString.get("editFormDateoftheappointmentColumnPlaceholder");
    this.namePlaceholder = this.uiString.get("editFormNameColumnHeader");
    this.descriptionPlaceholder = this.uiString.get("editFormDescriptionColumnHeader");
    this.ratePlaceholder = this.uiString.get("editFormRateColumnHeader");

    this.buildForm();
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.id = params.id;
      this.appointmentService.getAppointmentById(this.id).subscribe(res => {
        this.appointment = res;
        let dateParsed = new Date(this.appointment.date);
        this.selectedTime = "" + dateParsed.getHours() + ":" + dateParsed.getMinutes();
        this.selectedHour = "" + dateParsed.getHours();
        this.selectedMinute = "" + dateParsed.getMinutes();
        this.updateForm.get("date").setValue(this.appointment.date);
        this.updateForm.get("name").setValue(this.appointment.name);
        this.updateForm.get("description").setValue(this.appointment.description);
        this.updateForm.get("rate").setValue(this.appointment.rate);
      })
    })
  }

  buildForm() {
    this.updateForm = this.appointmentForm.group({
      date: [''],
      name: ['', Validators.required],
      rate: new FormControl({ value: '', disabled: true }),
      description: ['']
    });
  }

  updateAppointment(date, name, description) {

    //Reformat date into us format - for given French date locale
    let dateParsed = new Date(date.split("/").reverse().join("/"));

    if (isNaN(dateParsed.getTime())) {
      date = Date.now;
    } else {
      //Set selected time by timepicker
      dateParsed.setHours(parseInt(this.selectedHour));
      dateParsed.setMinutes(parseInt(this.selectedMinute));

      date = dateParsed.toString();
    }

    this.appointmentService.updateAppointment(this.id, date, name, description).subscribe(() => {
      this.snackBar.open("" + this.uiString.get("editSuccessSnackbar"), "OK", {
        duration: 4000
      });
    })
  }

  updateTime(time: String) {
    let timeSplitted = time.split(":");
    this.selectedHour = timeSplitted[0];
    this.selectedMinute = timeSplitted[1];
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
        this.selectedCurrency = " " + element.value;
      }
    });
  }

}
