const Flashcard = require("../models/flashcard");
const { getOrCreateUser } = require("../crud/user");
const { getCardCollectionByName } = require("../crud/cardCollection");

const kleur = require('kleur');
const moment = require("moment");

 /**
 * Create a new flashcard
 * @param {string} collection Collection new card will belong to
 * @param {string} title Title of the flashcard
 * @param {string} content Content of the flashcard
 * @param {string} discordId User's discord ID
 * @returns {Object} Created flashcard
*/
 async function createFlashcard(collection, title, content, discordId){
    const user = await getOrCreateUser(discordId);

    try {
        const flashcard = new Flashcard({
            title: title,
            content: content,
            owner: user,
            cardCollection: collection
        });
        await flashcard.save();

        collection.flashcards.push(flashcard._id);
        await collection.save();

        console.log(`${kleur.green().bold("[PUT]")} ${moment().format("DD-MM-YYYY HH:mm:ss")} User: ${discordId} created flashcard: ${flashcard._id}`);
        return flashcard;
    } catch (err) {
        console.error("Error creating flashcard: ", err);
        throw err;
    }
}

/**
 * Get a flashcard by its title
 * @param {string} collection Collection card belongs too
 * @param {string} title Title of flashcard 
 * @param {string} discordId User's discord ID
 * @returns {Object} Flashcard
 */
async function getFlashcardByTitle(collection, title, discordId){
    const user = await getOrCreateUser(discordId);

    try{
        const flashcard = await Flashcard.findOne({cardCollection: collection, title: title, owner: user});
        return flashcard;
    } catch (err){
        console.error("Error getting flashcard: ", err);
        throw err;
    }
}


/**
 * Delete a flashcard by its title
 * @param {string} colleciton Collection card belongs to
 * @param {string} title Title of flashcard
 * @param {string} discordId User's discord ID
 * @returns {void}
 */
async function deleteFlashcardByTitle(collection, title, discordId){
    const user = await getOrCreateUser(discordId);

    try{
        const flashcard = await Flashcard.findOneAndDelete({cardCollection: collection, title: title, owner: user});
        console.log(`${kleur.red().bold("[DEL]")} ${moment().format("DD-MM-YYYY HH:mm:ss")} User: ${discordId} deleted flashcard: ${flashcard._id}`);
    } catch(err){
        console.error("Error deleting flashcard: ", err);
        throw err;
    }
}

 module.exports = {
    createFlashcard,
    getFlashcardByTitle,
    deleteFlashcardByTitle
 }