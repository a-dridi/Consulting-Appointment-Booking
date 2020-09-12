import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AppointmentService } from 'src/app/appointment.service';
import { AdminDataSharingService } from 'src/app/admindatasharingservice';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AdminAccount } from 'src/app/adminaccount.model';
import { AppComponent } from 'src/app/app.component';
import { animate, keyframes, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-admin-login',
  templateUrl: './admin-login.component.html',
  styleUrls: ['./admin-login.component.css'],
  animations: [trigger('errorSwiggle', [
    transition('false => true', animate('500ms ease-in', 
    keyframes([
      style({ transform: 'translate3d(-1px, 0, 0', offset: 0.1 }),
      style({ transform: 'translate3d(2px, 0, 0', offset: 0.2 }),
      style({ transform: 'translate3d(-4px, 0, 0', offset: 0.3 }),
      style({ transform: 'translate3d(4px, 0, 0', offset: 0.4 }),
      style({ transform: 'translate3d(-4px, 0, 0', offset: 0.5 }),
      style({ transform: 'translate3d(4px, 0, 0', offset: 0.6 }),
      style({ transform: 'translate3d(-4px, 0, 0', offset: 0.7 }),
      style({ transform: 'translate3d(2px, 0, 0', offset: 0.8 })
      ])
    ))
  ])
  ]
})

export class AdminLoginComponent implements OnInit {
  public uiString: Map<String, String>;
  message: String;
  loginForm: FormGroup;
  adminAccountCreated: boolean = true;
  emailPlaceholder: String;
  passwordPlaceholder: String;
  loginFailed: boolean = false;

  constructor(private adminDataSharingService: AdminDataSharingService, private adminloginForm: FormBuilder, private router: Router, private appointmentService: AppointmentService, private snackBar: MatSnackBar) {
    this.uiString = AppComponent.uiStringFinal;
    this.emailPlaceholder = this.uiString.get("adminloginFormEmailPlaceholder");
    this.passwordPlaceholder = this.uiString.get("adminloginFormPasswordPlaceholder");

    this.appointmentService
      .getAdminAccount()
      .subscribe((data: AdminAccount[]) => {
        if (data.length < 1) {
          this.adminAccountCreated = false;
        }
      });
    this.loginForm = this.adminloginForm.group({
      email: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  ngOnInit(): void {

  }

  loginadmin(email, password) {
    if (!this.loginForm.valid) {
      this.snackBar.open("" + this.uiString.get("adminloginWrongPasswordSnackbar"), "OK", {
        duration: 4000
      });
      return;
    }

    this.appointmentService.doAdminLogin(JSON.stringify(this.loginForm.value))
      .subscribe(
        data => {
          console.log("You are logged in now.");
          this.appointmentService.adminName = this.loginForm.value.email;
          this.adminDataSharingService.adminLoggedIn.next(true);
          this.router.navigate(['/admin']);
          this.router.navigated = false;
        },
        error => {
          this.message = this.uiString.get("adminloginLoginFailedSnackbar");
          this.loginFailed = true;
        }
      );

  }

}
