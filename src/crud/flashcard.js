const Flashcard = require("../models/flashcard");
const { getOrCreateUser } = require("../crud/user");

const kleur = require('kleur');
const moment = require("moment");

 /**
 * Create a new flashcard
 * @param {string} collection Collection new card will belong to
 * @param {string} title Title of the flashcard
 * @param {string} content Content of the flashcard
 * @param {string} discordId User's discord ID
 * @returns {Promise<Flashcard>} Resolves to created flashcard object
*/
 async function createFlashcard(collection, title, content, discordId){
    const user = await getOrCreateUser(discordId);

    const flashcard = new Flashcard({
        title: title,
        content: content,
        owner: user,
        cardCollection: collection
    });
    await flashcard.save();

    console.log(`${kleur.green().bold("[PUT]")} ${moment().format("DD-MM-YYYY HH:mm:ss")} User: ${discordId} created flashcard: ${flashcard._id}`);
    return flashcard;
}

/**
 * Get a flashcard by its title
 * @param {mongoose.Types.ObjectId} collection Collection card belongs too
 * @param {string} title Title of flashcard 
 * @param {string} discordId User's discord ID
 * @returns {Promise<Flashcard|null>} Resolves to flashcard object or null if not found
 */
async function getFlashcardByTitle(collection, title, discordId){
    const user = await getOrCreateUser(discordId);

    const flashcard = await Flashcard.findOne({cardCollection: collection, title: title, owner: user});
    return flashcard;

}

/**
 * 
 * @param {mongoose.Types.ObjectId} collection Collection cards belong to
 * @param {string} discordId User's discord ID
 * @returns {Promise<Flashcard[]>} Resolves to array of flashcards
 */
async function getFlashcardsFromCollection(collection, discordId){
    const user = await getOrCreateUser(discordId);

    const flashcards = await Flashcard.find({cardCollection: collection, owner: user});
    return flashcards;
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

    const flashcard = await Flashcard.findOneAndDelete({cardCollection: collection, title: title, owner: user});
    console.log(`${kleur.red().bold("[DEL]")} ${moment().format("DD-MM-YYYY HH:mm:ss")} User: ${discordId} deleted flashcard: ${flashcard._id}`);
}

 module.exports = {
    createFlashcard,
    getFlashcardByTitle,
    getFlashcardsFromCollection,
    deleteFlashcardByTitle
};