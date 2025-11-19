const { Schema, model, models } = require("mongoose");

const flashcardSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    cardCollection: {
        type: Schema.Types.ObjectId,
        ref: "cardCollection",
        required: true,
    },
});

module.exports = models.Flashcard || model("Flashcard", flashcardSchema);