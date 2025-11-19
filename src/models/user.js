const { Schema, model, models } = require("mongoose");

const userSchema = new Schema({
    discordId: {
        type: String,
        required: true,
    },
})

module.exports = models.User || model("User", userSchema);