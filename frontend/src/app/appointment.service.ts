import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AppointmentService {

  uri = "http://localhost:4000"
  adminName: String = "";

  constructor(private http: HttpClient) {
  }

  getAppointments() {
    return this.http.get(`${this.uri}/appointments`);
  }

  getAppointmentById(id) {
    return this.http.get(`${this.uri}/appointments/${id}`);
  }

  addAppointment(date, name, description, rate) {
    const appointment = {
      date: date,
      name: name,
      description: description,
      rate: rate
    };
    return this.http.post(`${this.uri}/appointments/add`, appointment);
  }

  updateAppointment(id, date, name, description) {
    const appointment = {
      date: date,
      name: name,
      description: description
    };
    return this.http.post(`${this.uri}/appointments/edit/${id}`, appointment);
  }

  deleteAppointment(id) {
    return this.http.get(`${this.uri}/appointments/delete/${id}`);
  }

  bookAppointment(id, date, name, description, rate, clientId) {
    const appointment = {
      date: date,
      name: name,
      description: description,
      rate: rate,
      clientId: clientId
    }
    return this.http.post(`${this.uri}/appointments/book/${id}`, appointment);
  }

  processPayment(paymentId, token, PayerID) {
    return this.http.get(`${this.uri}/psuccess/${paymentId}/${token}/${PayerID}`);
  }

  getBookedAppointmentById(id) {
    return this.http.get(`${this.uri}/bookedappointments/${id}`);
  }

  getBookedAppointments() {
    return this.http.get(`${this.uri}/bookedappointments`);
  }

  deleteBookedAppointment(id){
    return this.http.get(`${this.uri}/bookedappointments/delete/${id}`);
  }

  //Check if admin user is authenticated to allow loading of admin section
  checkAdminAuthentication() {
    //return this.http.get(`${this.uri}/admin`);
    return this.http.get(`${this.uri}/admin`, {
      observe: 'body',
      withCredentials: true,
      headers: new HttpHeaders().append('Content-Type', 'application/json')
    })
  }


  doAdminLogin(body: any) {
    return this.http.post(`${this.uri}/login`, body, {
      observe: 'body',
      withCredentials: true,
      headers: new HttpHeaders().append('Content-Type', 'application/json')
    });
  }


  doAdminLogout() {
    return this.http.get(`${this.uri}/logout`, {
      observe: 'body',
      withCredentials: true,
      headers: new HttpHeaders().append('Content-Type', 'application/json')
    });
  }

  doAdminRegistration(email, password, name, telephone, note) {
    const adminaccount = {
      email: email,
      password: password,
      name: name,
      telephone: telephone,
      note: note
    };
    return this.http.post(`${this.uri}/registration`, adminaccount);
  }


  getClientById(id) {
    return this.http.get(`${this.uri}/client/${id}`);
  }

  getClients() {
    return this.http.get(`${this.uri}/clients`);
  }

  getBookedAppointmentsClients(){
    return this.http.get(`${this.uri}/bookedappointmentsclients`);
  }

  getBookedAppointmentsClientsToday(){
    return this.http.get(`${this.uri}/bookedappointmentsclientstoday`);
  } 
}
