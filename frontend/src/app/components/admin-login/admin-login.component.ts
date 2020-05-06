import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AppointmentService } from 'src/app/appointment.service';
import { AdminDataSharingService } from 'src/app/admindatasharingservice';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AdminAccount } from 'src/app/adminaccount.model';
import { AppComponent } from 'src/app/app.component';

@Component({
  selector: 'app-admin-login',
  templateUrl: './admin-login.component.html',
  styleUrls: ['./admin-login.component.css']
})
export class AdminLoginComponent implements OnInit {
  public uiString: Map<String, String>;
  message: String;
  showMessage: boolean = false;
  loginForm: FormGroup;
  adminAccountCreated: boolean = true;
  emailPlaceholder: String;
  passwordPlaceholder: String;

  constructor(private adminDataSharingService: AdminDataSharingService, private adminloginForm: FormBuilder, private router: Router, private appointmentService: AppointmentService, private snackBar: MatSnackBar) {
    this.uiString = AppComponent.uiStringFinal;
    this.emailPlaceholder = this.uiString.get("adminloginFormEmailPlaceholder");
    this.passwordPlaceholder = this.uiString.get("adminloginFormPasswordPlaceholder");

    this.appointmentService
    .getAdminAccount()
    .subscribe((data: AdminAccount[]) => {
      if(data.length<1){
        this.adminAccountCreated = false;
      }
    });
    this.loginForm = this.adminloginForm.group({
      email: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    //get msg text from uri
    let uriArray = (window.location.pathname).split("=");
    if (uriArray[1] !== undefined) {
      let uriMsg = uriArray[1].replace("%20", " ");
      if ((typeof uriMsg !== undefined) && uriMsg != null) {
        this.showMessage = true;
        this.message = uriMsg;
      }
    }

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
          this.appointmentService.adminName=this.loginForm.value.email;
          this.adminDataSharingService.adminLoggedIn.next(true);
          this.router.navigate(['/admin']);
          this.router.navigated = false;
        },
        error => this.snackBar.open(""+this.uiString.get("adminloginLoginFailedSnackbar"), "OK", {
          duration: 10000
        })
      );
      
  }

}
