const User = require("../models/user");

/**
 * Returns a user if they exist or creates a new one and returns it
 * @param {string} discordId - Discord user ID of user
 * @returns {Promise<User>} Resolves to User object
 */
async function getOrCreateUser(discordId){

    let user = await User.findOne({discordId});

    if(!user){
        user = await User.create({discordId});
    }

    return user;
}

module.exports = {
    getOrCreateUser
};