const User = require("../models/user");

/**
 * Returns a user if they exist or creates a new one and returns it
 * @param {string} discordId - Discord user ID of user
 * @returns {Object} User object
 */
async function getOrCreateUser(discordId){
    try{
        let user = await User.findOne({discordId});
    
        if(!user){
            user = await User.create({discordId});
        }
    
        return user;
    }
    catch(err){
        console.error("Error getting or creating user ", err);
        throw err;
    }
}

module.exports = {
    getOrCreateUser
}