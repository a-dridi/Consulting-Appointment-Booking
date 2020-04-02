import { Component, OnInit } from '@angular/core';
import { AppointmentService } from '../../appointment.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';


@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.css']
})
export class CreateComponent implements OnInit {

  createForm: FormGroup;
  selectedHour: string;
  selectedMinute: string;

  constructor(private appointmentService: AppointmentService, private appointmentForm: FormBuilder, private router: Router, private snackBar: MatSnackBar) {
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
        this.appointmentService.addAppointment(date, name, description, parsedRate.toFixed(2)).subscribe(() => {
          this.router.navigate(['/allappointments']);
        });
      } else {
        this.snackBar.open("ERROR: Your rate must have a value of at least 1 (>=1)", "OK", {
          duration: 4000
        });

      }
    } else {
      this.appointmentService.addAppointment(date, name, description, 1.00).subscribe(() => {
        this.router.navigate(['/allappointments']);
        this.snackBar.open("New appointment was added", "OK", {
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

}
