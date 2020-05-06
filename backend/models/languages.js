import mongoose from "mongoose";
/**
 * UI text and translation
 */
const Schema = mongoose.Schema;

let Languages = new Schema({

    code: {
        type: String,
        required: [true, "Please enter a code for the translation text"]
    },
    translation: {
        type: String
    },
    language: {
        type: String,
        required: [true, "Please enter a language code (iso code e.g. en for English)"]
    },
});

Languages.index({code: 1, language: 1}, {unique: true});
export default mongoose.model("Languages", Languages);
