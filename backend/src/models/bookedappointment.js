import mongoose from "mongoose";
/**
 * Appointments that where booked by clients
 */
const Schema = mongoose.Schema;

let BookedAppointment = new Schema({

    date: {
        type: Date,
        default: Date.now
    },
    name: {
        type: String,
        default: "Consulting Appointment"
    },
    description: {
        type: String
    },
    rate: {
        type: Number,
        default: 0
    },
    clientId: {
        type: mongoose.Schema.ObjectId,
        required: [true, "Please add ObjectID _id of Client"]
    }
});

export default mongoose.model("BookedAppointment", BookedAppointment);