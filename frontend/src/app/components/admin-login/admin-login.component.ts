import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AppointmentService } from 'src/app/appointment.service';
import { AdminDataSharingService } from 'src/app/admindatasharingservice';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-admin-login',
  templateUrl: './admin-login.component.html',
  styleUrls: ['./admin-login.component.css']
})
export class AdminLoginComponent implements OnInit {

  message: String;
  showMessage: boolean = false;
  loginForm: FormGroup;
 

  constructor(private adminDataSharingService: AdminDataSharingService, private adminloginForm: FormBuilder, private router: Router, private appointmentService: AppointmentService, private snackBar: MatSnackBar) {
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
      this.snackBar.open(" Please enter your correct email address and password of your admin account!", "OK", {
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
        error => this.snackBar.open("LOGIN FAILED. Please enter your correct email address and password of your admin account. ", "OK", {
          duration: 10000
        })
      );
      
  }

}
