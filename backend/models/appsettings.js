import mongoose from "mongoose";
/**
 * Application settings - Set by user
 */
const Schema = mongoose.Schema;

let AppSettings = new Schema({

    code: {
        type: String,
        required: [true, "Please enter a code for the appsetting"]
    },
    value: {
        type: String
    }
});

AppSettings.index({code: 1}, {unique: true})
export default mongoose.model("AppSettings", AppSettings);
