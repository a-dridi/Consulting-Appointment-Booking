# Consulting Appointment Booking

A web app (MEAN stack) to administrate and book consulting appointments.

![Screenshot of application](https://raw.githubusercontent.com/a-dridi/Consulting-Appointment-Booking/master/screenshot.PNG)

## Demo
There as a demo version available:
https://fast-woodland-47882.herokuapp.com/

Admin user account: max.mustermann@mydomain.net - Password: 123456

## Video
https://youtu.be/EWYUoETQnEw 

## Features
* Clients can book an appointment without registration
* Book appointment and pay through Paypal
* Appointments are sorted by date
* Admin can edit, delete or add appointments which can be booked by clients
* Client information are saved when the client paid through Paypal
* Admin dashboard that shows you the appointments for the current day with client information (name, email, etc.)

## Configuration

Please adjust the file "server.js" in the folder "backend" to your server settings. 
NOTICE: Please set your domain names in the cors section (line number 40) in the file "server.js".


## API
The id field of MongoDB is used to reference an entry. If you want to see all the available API routes, then please go to the file server.js that is in the folder "backend".

- Get all available appointments (appointments that can be booked by clients) - GET request:
```
GET /api/appointments
```

- Get an available appointments for a certain ID - GET request:
```
GET /api/appointments/ID
```
- Add an appointment that can be booked by clients - POST request:
```
POST /api/appointments/add`
```
```
{
    "date": "2020-03-18T17:00:00.000Z",
	"name": "SME Consulting Appointment",
    "description": "Introduction for young entrepeneurs and entrepeneurs with now business background.",
	"rate": 14.00
}
```
If you define no date, then the current date and time is added.

- Delete an available appointment of a certain ID - GET request:
```
GET /api/appointments/delete/ID
```

- Delete an available appointment of a certain id - POST request:
```
POST /api/appointments/update/ID
```
```
{
    "date": "2020-03-19T17:00:00.000Z",
	"name": "SME Consulting Appointment Brazil",
    "description": "Introduction for young entrepeneurs and entrepeneurs with now business background.",
	"rate": 12.00
}
```
- All booked appointments with client information - GET request:
```
GET /api/bookedappointmentsclients
```

- All booked appointments with client information that have the current date - GET request:
```
GET /api/bookedappointmentsclientstoday
```

## Deployment
To create a production version.

- Backend:
```
npm install
```
```
npm run build
```

- Frontend:
```
npm install
```
```
ng build --prod=true
```

## Run
To start the application directly. You need to have NodeJS and MongoDB installed.

**Start Database server (In Windows):**
```
bin/mongod.exe
```

**Start backend server:**
```
cd backend
```
```
npm run dev
```

**Start Frontend server:**
```
cd frontend
```
```
ng serve --open
```

## Screenshots
![Screenshot2 of application](https://raw.githubusercontent.com/a-dridi/Consulting-Appointment-Booking/master/screenshot2.PNG)
![Screenshot3 of application](https://raw.githubusercontent.com/a-dridi/Consulting-Appointment-Booking/master/screenshot3.PNG)


## Authors

* **A. Dridi** - [a-dridi](https://github.com/a-dridi/)
