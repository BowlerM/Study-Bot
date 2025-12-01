const { Schema, model, models } = require("mongoose");

const cardCollectionSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    owner: {
        type: Schema.Types.ObjectId, 
        ref: "User", 
        required: true
    },
})

module.exports = models.cardCollection || model("CardCollection", cardCollectionSchema);