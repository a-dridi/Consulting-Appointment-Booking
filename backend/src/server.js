import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import mongoose from "mongoose";

//Models DB
import AdminAccount from "./models/AdminAccount";
import AvailableAppointment from "./models/AvailableAppointment";
import BookedAppointment from "./models/BookedAppointment";

import Client from "./models/Client";
const session = require('express-session');
const bcrypt = require('bcryptjs');
const passport = require("passport");

//Paypal payment
const paypal = require('paypal-rest-sdk');

paypal.configure({
    'mode': 'sandbox',
    'client_id': 'AaHuY-3wv7rc65yklM482wjQcbC3fYw_l5zsHM5ZxT4wX5ka9PK5Kp03dq5zZyRBuRh1zTt_sdS1K8V4',
    'client_secret': 'EJ4ZnsF1XUlLUndQm_q39eLH7Ub9YCjlybAoBkWmjen5YcD3IAJ8ZmIRgRyKBSsjhQHT_4D_zHEsVoSz'
});
require('./passport')(passport);

//Prod mode
if (process.env.NODE_ENV !== 'production') {

}


//CHANGE THIS --- DOMAIN NAME (+ Port number if used) OF THE WEBSITE/WEB SERVER WHERE THIS APPLICATION IS RUNNING - Ex.: https://mydomain.tld
const thisDomainName = "http://localhost:4200"
const thisDomainNameOnly = "http://localhost"

//DATABASE CONNECTION SETTINGS -- EDIT THIS
mongoose.connect("mongodb://localhost:27017/appointmentsdb");
//DATABASE CONNECTION SETTINGS -- EDIT THIS - END

//CHANGE THIS END

const DBConnection = mongoose.connection;
DBConnection.once("open", () => {
    console.log("Database connection sucessfully established.");
})


//Express Server
const app = express();
const router = express.Router();


//CORS ALLOWED URLS - ONLY YOUR OWN WEBSITE DOWN and PAYPAL
var allowedOrigins = [thisDomainNameOnly + ':3000', thisDomainNameOnly + ':4200', thisDomainNameOnly + ':4000', 'http://localhost:4000/login', 'https://www.sandbox.paypal.com/checkoutnow', 'https://www.sandbox.paypal.com', 'https://sandbox.paypal.com', 'https://paypal.com', 'https://www.paypal.com', 'https://www.paypal.com/checkoutnow'];


app.use(cors({
    credentials: true,
    origin: function (origin, callback) {    // allow requests with no origin 
        if (!origin) {
            return callback(null, true);
        }


        if (allowedOrigins.indexOf(origin) === -1) {
            var msg = 'The CORS policy for this site does not ' +
                'allow access from the specified Origin.';
            return callback(new Error(msg), false);
        }

        return callback(null, true);
    }
}));



//App
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Session and authentication managment - Passport JS
const MongoStore = require('connect-mongo')(session);
app.use(session({
    secret: 'sessionsecret392bx',
    resave: true,
    saveUninitialized: true,
    cookie: {
        maxAge: 36000000,
        httpOnly: false,
        secure: false
    },
    store: new MongoStore({ mongooseConnection: mongoose.connection })
}));
app.use(passport.initialize());
app.use(passport.session());

router.route("/appointments/:id").get((req, res) => {
    AvailableAppointment.findById(req.params.id, (err, appointment) => {
        if (err) {
            console.log("DB error - getOneAvailableAppointment: " + err);
        } else {
            res.json(appointment);
        }
    })
});

/**
 * Load all ui text of a translation from a file in the folder "languages"
 */
router.route("/language/:languagecode").get((req, res) => {
    Languages.find({ 'language': ':languagecode' }, 'code translation', function (err, translation) {
        if (err) {
            console.log(err);
            return;
        }

        if (data.length == 0) {
            console.log("Translation not available. Select default English translation ")
            Languages.find({ 'language': 'en' }, 'code translation', function (err, translation) {
                if (err) {
                    console.log(err);
                    return;
                }

                if (data.length == 0) {
                    console.log("Please add at least one translation. A default translation English");
                    return;
                }

                //Process data
                res.json(translation);
            });
            return;
        }

        //Process data
        res.json(translation);
    });
});



// **** Admin authentication routes START ****

function isAdminUserAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        //res.status(200).json("Session still active");
        return true;
    } else {
        console.log("valided user fail");
        //res.status(400).json("You have to login to access this site");
        res.redirect('admin-login');
        return false;
    }
}

//Registration
router.route("/registration").post((req, res, next) => {
    let registrationUser = req.body;

    if (registrationUser.email.indexOf("@") === -1 || registrationUser.email.indexOf(".") === -1 || registrationUser.email.length < 7) {
        res.status(400).send("Please enter a correct email address!");
        return;
    }

    if (registrationUser.password.length < 6) {
        res.status(400).send("Password must be at least 6 characters long!");
        return;
    }

    /*
    if (registrationUser.password !== registrationUser.password2) {
        res.status(400).send("Password and Password confirmation must be the same!");
        return;
    }
    */

    //Check if user does not exist and DO REGISTRATION
    AdminAccount.findOne({ email: registrationUser.email }).then(adminaccount => {
        if (adminaccount) {
            res.status(400).send("Admin account already exist! Please login with your email address and password.");
        } else {
            //Do registration
            let newAdminUser = new AdminAccount({
                email: req.body.email,
                password: req.body.password,
                name: req.body.name,
                telephone: req.body.telephone,
                note: req.body.note
            });
            bcrypt.genSalt(10, (err, salt) =>
                bcrypt.hash(newAdminUser.password, salt, (err, hash) => {
                    if (err) {
                        res.status(400).send(err);
                        return;
                    } else {
                        newAdminUser.password = hash;
                        newAdminUser.save()
                            .then(adminaccount => res.json("Admin account was successfully created."))
                            .catch(err => res.status(400).send(err));
                    }
                }))

        }
    });
});

// Login
router.route("/login").post((req, res, next) => {

    //console.log("log email: " + req.body.email);
    passport.authenticate('local', function (err, user, info) {
        if (err) { return res.status(500).json(err); }
        if (!user) { return res.status(420).json(info); }
        req.logIn(user, function (err) {
            if (err) { return res.status(410).json(err); }
            console.log("Login done");
            res.json("Login was successfully. ");
        });
    })(req, res, next);

});


// Logout
router.route('/logout').get((req, res, next) => {
    if (isAdminUserAuthenticated(req, res, next)) {
        req.logout();
        res.json("Logout was successful.");
        //res.redirect('allappointments');
    }
})

// **** Admin authentication routes END ****

//Admin section
router.route("/admin").get((req, res, next) => {
    isAdminUserAuthenticated(req, res, next);
    return res.status(200).json(req.user);
})


/*Database Data - DAO
*
*/
//getAllAvailableAppointments:
router.route("/appointments").get((req, res) => {
    AvailableAppointment.find({}).sort({ date: 1 }).exec((err, appointments) => {
        if (err) {
            console.log("DB error - getAllAvailableAppointments: " + err);
        } else {
            res.json(appointments);
        }
    })
});
//getOneAppointment:
router.route("/appointments/:id").get((req, res) => {
    AvailableAppointment.findById(req.params.id, (err, appointment) => {
        if (err) {
            console.log("DB error - getOneAvailableAppointment: " + err);
        } else {
            res.json(appointment);
        }
    })
});

//addAvailableAppointment
router.route("/appointments/add").post((req, res) => {
    let appointment = new AvailableAppointment(req.body);
    appointment.save()
        .then(appointment => {
            res.status(200).json({ "appointment": "New appointment was added successfully" })
        })
        .catch(err => {
            res.status(400).send("Failed to add new record into the database");
        });
});
//editAvailableAppointment - Update existing Available Appointment
router.route("/appointments/edit/:id").post((req, res) => {
    AvailableAppointment.findById(req.params.id, (err, appointment) => {
        if (!appointment) {
            return next(new Error("Could not load appointment from database"));
        } else {
            appointment.date = req.body.date;
            appointment.name = req.body.name;
            appointment.description = req.body.description;

            appointment.save()
                .then(appointment => {
                    res.json("Appointment was successfully updated.")
                })
                .catch(err => {
                    res.status(400).update("Update failed. ");
                });

        }
    });
})
//deleteAvailableAppointment - Delete an existing Available Appointment
router.route("/appointments/delete/:id").get((req, res) => {
    AvailableAppointment.findByIdAndRemove({ _id: req.params.id }, (err, appointment) => {
        if (err) {
            res.json(err);
        } else {
            res.json("Appointment was removed successfully. ")
        }
    });
});

//bookAvailableAppointment - Delete an existing AvailableAppointment and add it to BookedAppointment with the clientid
router.route("/appointments/book/:id").post((req, res) => {

    var create_payment_json = {
        "intent": "sale",
        "payer": {
            "payment_method": "paypal"
        },
        "redirect_urls": {
            "return_url": "" + thisDomainName + "/processpayment",
            "cancel_url": "" + thisDomainName + "/paymentcancel"
        },
        "transactions": [{
            "item_list": {
                "items": [{
                    "name": req.body.name,
                    "sku": "" + req.params.id,
                    "price": req.body.rate,
                    "currency": "USD",
                    "quantity": 1
                }]
            },
            "amount": {
                "currency": "USD",
                "total": req.body.rate
            },
            "description": req.body.description
        }]
    };


    paypal.payment.create(create_payment_json, function (error, payment) {
        if (error) {
            throw error;
        } else {
            console.log("Create Payment Response");
            console.log(payment);
            if (payment.links) {
                for (let i = 0; i < payment.links.length; i++) {
                    if (payment.links[i].rel === "approval_url") {
                        res.status(200).json(payment.links[i].href);
                        //console.log("approve payment");
                        break;
                    }
                }
            }
        }
    });

});

//Paypal payment processing:
router.route('/psuccess/:payementId/:token/:PayerID').get((req, res) => {

    console.log("Process successfull payment");

    const paymentId = req.params.payementId;
    const payerId = req.params.PayerID;
    const totalAmount = "";

    //Debug
    console.log("params paymentId: " + paymentId);
    console.log("params payerId: " + payerId);
    console.log("Total amount: " + totalAmount);
    console.log("URL full: " + req.originalUrl);


    const execute_payment_json = {
        "payer_id": payerId
    };

    paypal.payment.execute(paymentId, execute_payment_json, function (error, payment) {
        if (error) {
            console.log("Payment proccessing error: " + error.response);
            throw error;
        } else {
            //Add client if does not exist and get clientid
            console.log("payment: " + JSON.stringify(payment));
            console.log("payer: " + JSON.stringify(payment.payer));
            //let payerObj = JSON.parse(payment.payer);
            let paymentStr = JSON.stringify(payment);
            let paymentObj = JSON.parse(paymentStr);
            console.log("payer email: " + paymentObj.payer.payer_info.email);
            console.log("payer firstname: " + paymentObj.payer.payer_info.first_name);
            console.log("payer lastname: " + paymentObj.payer.payer_info.last_name);
            console.log("payer sku: " + paymentObj.transactions[0].item_list.items[0].sku)

            let appointmentId = paymentObj.transactions[0].item_list.items[0].sku;
            //Do actual booking
            createClientAndBookAppointment("" + paymentObj.payer.payer_info.first_name, "" + paymentObj.payer.payer_info.last_name, "" + paymentObj.payer.payer_info.email, "", appointmentId, res);
            //res.redirect("/paymentsuccess");
        }
    })

});

/**
 * Create Client (if client doesnt exist) and book a new Appointment for that client
 */
function createClientAndBookAppointment(forename, surname, email, telephone, appointmentId, res) {


    //Search if client exist. If client exist return client.
    Client.findOne({ 'email': email }, 'email', function (err, client) {
        console.log("Find email: " + email);
        if (client != null) {
            console.log("Existing client: " + (client)._id);
            bookAppointment("" + (client)._id, appointmentId, res);
        } else {
            console.log("Client does not exist: ");
            const newClientValues = {
                forename: forename,
                surname: surname,
                email: email,
                telephone: telephone,
            }

            let newClient = new Client(newClientValues);
            newClient.save()
                .then(client => {
                    //res.status(200).json({ "client": "New client was added successfully" })
                    console.log("new Client id: " + client._id);
                    bookAppointment("" + (client)._id, appointmentId, res);
                })
                .catch(err => {
                    new Error("Failed to add new client into the database: " + err);
                });
        }
    });

}

/**
 * Book appointment. Call only after successfull payment and client was created.
 */
function bookAppointment(clientId, appointmentId, res) {
    console.log("Book Client id: " + clientId);
    console.log("Book Appointment id: " + appointmentId);

    //load appointment object
    AvailableAppointment.findByIdAndRemove({ _id: appointmentId }, (err, appointment) => {
        if (err) {
            throw err;
        } else {
            const newBookedAppointment = {
                "date": appointment.date,
                "name": appointment.name,
                "description": appointment.description,
                "rate": appointment.rate,
                "clientId": clientId
            };

            let booked = new BookedAppointment(newBookedAppointment);
            console.log("Do booking appointment ---- ");
            booked.save()
                .then(booked => {
                    console.log("saved booking appointment ---- ");
                    console.log("id of new booked appointment: " + booked.id);
                    res.status(200).json("" + booked._id);
                }).catch(err => {
                    throw err;
                });
        }
    });
}

//getAllBookedAppointments:
router.route("/bookedappointments").get((req, res) => {
    BookedAppointment.find({}).sort({ date: 1 }).exec((err, bookedappointments) => {
        if (err) {
            console.log("DB error - getAllBookedAppointments: " + err);
        } else {
            res.json(bookedappointments);
        }
    })
});
//getOneBookedAppointment:
router.route("/bookedappointments/:id").get((req, res) => {
    BookedAppointment.findById(req.params.id, (err, bookedappointment) => {
        if (err) {
            console.log("DB error - getOneBookedAppointment: " + err);
        } else {
            res.json(bookedappointment);
        }
    })
});

//deleteBookedAppointment - Delete an existing Booked Appointment
router.route("/bookedappointments/delete/:id").get((req, res) => {
    BookedAppointment.findByIdAndRemove({ _id: req.params.id }, (err, bookedappointment) => {
        if (err) {
            res.json(err);
        } else {
            res.json("Booked Appointment was removed successfully. ")
        }
    });
});

//getAllClients:
router.route("/clients").get((req, res) => {
    Client.find((err, client) => {
        if (err) {
            console.log("DB error - getAllClients: " + err);
        } else {
            res.json(client);
        }
    })
});
//getOneClient:
router.route("/client/:id").get((req, res) => {
    Client.findById(req.params.id, (err, client) => {
        if (err) {
            console.log("DB error - getOneClient: " + err);
        } else {
            res.json(client);
        }
    })
});

//updateTelephoneOfOneClient
router.route("/client/updatephone/:id").post((req, res) => {
    Client.findById(req.params.id, (err, client) => {
        if (!client) {
            return next(new Error("Could not load client from database"));
        } else {
            client.telephone = req.body.telephone;

            client.save()
                .then(client => {
                    res.json("Client telephone number was successfully updated.")
                })
                .catch(err => {
                    res.status(400).update("Update failed. ");
                });

        }
    });
})


//getBookedAppointmentsClients:
router.route("/bookedappointmentsclients").get((req, res) => {
    BookedAppointment.db.collection("bookedappointments").aggregate([
        {
            "$addFields":
                { "clientId": { "$toObjectId": "$clientId" } }
        },
        {
            $lookup:
            {
                from: 'clients',
                localField: 'clientId',
                foreignField: '_id',
                as: 'clientdetails'
            }
        },
        {
            "$sort":
                { "date": 1 }
        },
    ]).toArray(function (err, res2) {
        if (err) {
            throw err;
        }
        //console.log(JSON.stringify(res2));
        res.json(res2);
    });
});


//getBookedAppointmentsClientsToday:
router.route("/bookedappointmentsclientstoday").get((req, res) => {
    BookedAppointment.db.collection("bookedappointments").aggregate([
        {
            "$addFields":
                { "clientId": { "$toObjectId": "$clientId" } }
        },
        {
            "$project": {
                "year": {
                    "$year": "$date"
                },
                "month": {
                    "$month": "$date"
                },
                "day": {
                    "$dayOfMonth": "$date"
                },
                "date": "$date",
                "name": "$name",
                "description": "$description",
                "rate": "$rate",
                "clientId": "$clientId",
                "forename": "$forename",
                "surname": "$surname",
                "email": "$email",
                "telephone": "$telephone"
            }
        },
        {
            $lookup:
            {
                from: 'clients',
                localField: 'clientId',
                foreignField: '_id',
                as: 'clientdetails'
            }
        },
        {
            $match: {
                "year": new Date().getFullYear(),
                "month": new Date().getMonth() + 1, //Month January starts with 0
                "day": new Date().getDate()
            }
        }
    ]).toArray(function (err, res2) {
        if (err) {
            throw err;
        }
        //console.log(JSON.stringify(res2));
        res.json(res2);
    });
});

//Routing - to ExpressJS Server
app.use("/", router)

//Debug expressjs server
//app.get("/", (req,res) => res.send("The express JS server and application is working. "));
const expressServerPort = 4000;
app.listen(expressServerPort, () => console.log("Express Server is currently running on the port " + expressServerPort));