import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {ListComponent} from './components/list/list.component';
import {CreateComponent} from './components/create/create.component';
import {EditComponent} from './components/edit/edit.component';
import {HttpClientModule, HttpClient} from '@angular/common/http';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatFormFieldModule} from '@angular/material/form-field'; 
import {MatInputModule} from '@angular/material/input'; 
import {MatOptionModule} from '@angular/material/core'; 
import {MatSelectModule} from "@angular/material/select";
import {MatIconModule} from "@angular/material/icon";
import {MatButtonModule} from "@angular/material/button";
import {MatCardModule} from "@angular/material/card";
import {MatTableModule} from "@angular/material/table";
import {MatDividerModule} from "@angular/material/divider";
import {MatSnackBarModule} from '@angular/material/snack-bar'; 
import {ReactiveFormsModule} from "@angular/forms";
import {MatDatepickerModule} from '@angular/material/datepicker'; 
import {MatNativeDateModule} from '@angular/material/core'; 
import {AppointmentService} from './appointment.service';
import {NgxMaterialTimepickerModule} from 'ngx-material-timepicker';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';
import { BookComponent } from './components/book/book.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { PaymentsuccessComponent } from './components/paymentsuccess/paymentsuccess.component';
import { PaymentcancelComponent } from './components/paymentcancel/paymentcancel.component';
import { ProcesspaymentComponent } from './components/processpayment/processpayment.component';
import { AdminComponent } from './components/admin/admin.component';
import { AdminLoginComponent } from './components/admin-login/admin-login.component';
import { AdminRegistrationComponent } from './components/admin-registration/admin-registration.component';
import { CheckadminauthenticationComponent } from './components/checkadminauthentication/checkadminauthentication.component';
import { AdminLogoutComponent } from './components/admin-logout/admin-logout.component';
import { AdminDataSharingService } from './admindatasharingservice';

const appRoutes: Routes = [
{path: "create", component: CreateComponent},
{path: 'edit/:id', component: EditComponent},
{path: 'book/:id', component: BookComponent},
{path: 'allappointments', component: ListComponent},
{path: 'paymentsuccess/:id', component: PaymentsuccessComponent},
{path: 'paymentcancel', component: PaymentcancelComponent},
{path: 'processpayment', component: ProcesspaymentComponent},
{path: 'admin', component: AdminComponent},
{path: 'admin-login', component: AdminLoginComponent},
{path: 'admin-logout', component: AdminLogoutComponent},
{path: 'admin-registration', component: AdminRegistrationComponent},

{path: '', redirectTo: 'allappointments', pathMatch: 'full'}
];



@NgModule({
  declarations: [
    AppComponent,
    ListComponent,
    CreateComponent,
    EditComponent,
    BookComponent,
    PaymentsuccessComponent,
    PaymentcancelComponent,
    ProcesspaymentComponent,
    ProcesspaymentComponent,
    AdminComponent,
    AdminLoginComponent,
    AdminLogoutComponent,
    AdminRegistrationComponent,
    CheckadminauthenticationComponent
  ],
  imports: [
    MatToolbarModule,
    RouterModule.forRoot(appRoutes),
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    MatFormFieldModule,
    MatInputModule,
    MatOptionModule,
    MatSelectModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatTableModule,
    MatDividerModule,
    MatSnackBarModule,
    ReactiveFormsModule,
    MatDatepickerModule,
    MatNativeDateModule,
    NgxMaterialTimepickerModule,
    MatProgressSpinnerModule
  ],
  providers: [AppointmentService, {provide: MAT_DATE_LOCALE, useValue: 'fr-FR'}, AdminDataSharingService],
  bootstrap: [AppComponent]
})
export class AppModule { }
