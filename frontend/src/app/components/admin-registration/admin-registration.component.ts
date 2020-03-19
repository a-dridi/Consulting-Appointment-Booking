import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AppointmentService } from 'src/app/appointment.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-registration',
  templateUrl: './admin-registration.component.html',
  styleUrls: ['./admin-registration.component.css']
})
export class AdminRegistrationComponent implements OnInit {

  adminaccountregistered: Boolean = false;
  registrationForm: FormGroup;


  constructor(private adminregistrationForm: FormBuilder, private router: Router, private snackBar: MatSnackBar, private appointmentService: AppointmentService) {
    this.registrationForm = this.adminregistrationForm.group({
      email: ['', [Validators.email, Validators.required]],
      name: ['', Validators.required],
      password: ['', Validators.required],
      password2: ['', Validators.required],
      telephone: [''],
      note: ['']
    });

  }

  ngOnInit(): void {
  }


  registeradmin(email, password, password2, name, telephone, note) {
    if (!this.registrationForm.valid) {
      this.snackBar.open("Please enter all required fields correctly!", "OK", {
        duration: 10000
      });
      return;
    } else if(password != password2) {
      this.snackBar.open("Password and Password confirmation must be the same!", "OK", {
        duration: 10000
      });
      return;
    } else if(password.length < 6){
      this.snackBar.open("Password must be at least 6 characters long!", "OK", {
        duration: 10000
      });
      return;
    }

    
    this.appointmentService.doAdminRegistration(email, password, name, telephone, note)
      .subscribe(
        data => {
          this.router.navigate(['/admin-login']);
          this.snackBar.open("OK. Registration is done. Please login with your account credentials now.", "OK", {
            duration: 10000
          });
        },
        error => {
          console.log(error);

          this.snackBar.open("Registration failed! Please enter all required fields correctly.", "OK", {
            duration: 10000
          });

        }
      )


  }
}
