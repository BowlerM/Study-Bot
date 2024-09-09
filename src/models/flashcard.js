const { Schema, model, models } = require("mongoose");

const flashcardSchema = new Schema({
    userId: {
        //Discord User ID
        type: String,
        required: true
    },
    title: {
        type: String,
        requred: true
    },
    content: {
        type: String,
        required: true
    }
});

const name = "flashcard";

module.exports = models[name] || model(name, flashcardSchema)