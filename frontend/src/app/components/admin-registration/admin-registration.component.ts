import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AppointmentService } from 'src/app/appointment.service';
import { Router } from '@angular/router';
import { AdminAccount } from 'src/app/adminaccount.model';
import { AppComponent } from 'src/app/app.component';

@Component({
  selector: 'app-admin-registration',
  templateUrl: './admin-registration.component.html',
  styleUrls: ['./admin-registration.component.css']
})
export class AdminRegistrationComponent implements OnInit {
  public uiString: Map<String, String>;
  adminAccountCreated: boolean = true;
  registrationForm: FormGroup;
  namePlaceholder: String;
  emailPlaceholder: String;
  passwordPlaceholder: String;
  passwordconfirmationPlaceholder: String;
  telephonePlaceholder: String;
  notePlaceholder: String;
  
  constructor(private adminregistrationForm: FormBuilder, private router: Router, private snackBar: MatSnackBar, private appointmentService: AppointmentService) {
    this.uiString = AppComponent.uiStringFinal;
    this.namePlaceholder = this.uiString.get("adminregisterFormNamePlaceholder");
    this.emailPlaceholder = this.uiString.get("adminregisterFormEmailPlaceholder");
    this.passwordPlaceholder = this.uiString.get("adminregisterFormPasswordPlaceholder");
    this.passwordconfirmationPlaceholder = this.uiString.get("adminregisterFormPasswordconfirmationPlaceholder");
    this.telephonePlaceholder = this.uiString.get("adminregisterFormTelephonePlaceholder");
    this.notePlaceholder = this.uiString.get("adminregisterFormNotePlaceholder");
    
    this.appointmentService
    .getAdminAccount()
    .subscribe((data: AdminAccount[]) => {
      if(data.length<1){
        this.adminAccountCreated = false;
      }
    });

    this.registrationForm = this.adminregistrationForm.group({
      name: ['', Validators.required],
      email: ['', [Validators.email, Validators.required]],
      password: ['', Validators.required],
      password2: ['', Validators.required],
      telephone: [''],
      note: ['']
    });
  }

  ngOnInit(): void {
  }


  registeradmin(name, email, password, password2, telephone, note) {
    if (!this.registrationForm.valid) {
      this.snackBar.open(""+ this.uiString.get("adminregisterEmptyFieldSnackbar"), "OK", {
        duration: 10000
      });
      return;
    } else if(password != password2) {
      this.snackBar.open(""+ this.uiString.get("adminregisterPasswordNotSameSnackbar"), "OK", {
        duration: 10000
      });
      return;
    } else if(password.length < 6){
      this.snackBar.open("" + this.uiString.get("adminregisterPasswordTooShortSnackbar"), "OK", {
        duration: 10000
      });
      return;
    }

    
    this.appointmentService.doAdminRegistration(email, password, name, telephone, note)
      .subscribe(
        data => {
          this.router.navigate(['/admin-login']);
          this.snackBar.open("" + this.uiString.get("adminregisterRegistrationSuccessSnackbar"), "OK", {
            duration: 10000
          });
        },
        error => {
          console.log(error);

          this.snackBar.open("" + this.uiString.get("adminregisterRegistrationFailedSnackbar"), "OK", {
            duration: 10000
          });

        }
      )


  }
}
