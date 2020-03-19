import mongoose from "mongoose";
/**
 * Available appointments that are created by an admin user
 */
const Schema = mongoose.Schema;

let AvailableAppointment = new Schema(
    {
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
        }
    }
);

export default mongoose.model("AvailableAppointment", AvailableAppointment);