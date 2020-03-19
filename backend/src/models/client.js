import mongoose from "mongoose";
/**
 * Clients who book an appointment for the first time are saved here. Clients cannot access full site (admin part of this web app)
 */
const Schema = mongoose.Schema;

let Client = new Schema({

    forename: {
        type: String
    },
    surname: {
        type: String
    },
    email: {
        type: String,
        required: [true, "Please enter an email address"]
    },
    telephone: {
        type: String
    }
});

export default mongoose.model("Client", Client);