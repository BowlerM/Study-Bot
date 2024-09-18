const Flashcard = require("../models/flashcard");
const kleur = require('kleur');
const moment = require("moment");

 /**
  * Create a new flashcard
  * @param {string} title - Title of the flashcard
  * @param {string} content - Content of the flashcard
  * @param {string} userId - Discord user ID of user creating flashcard
  * @returns {Object} Created flashcard
  */
 async function createFlashcard(title, content, userId){
    try {
        const flashcard = new Flashcard({
            title: title,
            content: content,
            userId: userId
        });
        await flashcard.save();
        console.log(`${kleur.green().bold("[PUT]")} ${moment().format("DD-MM-YYYY HH:mm:ss")} User: ${userId} created flashcard: ${flashcard._id}`);
        return flashcard;
    } catch (err) {
        console.error("Error creating flashcard: ", err);
        throw err;
    }
 }

/**
 * Get a flashcard by its title
 * @param {string} title - Title of flashcard (unique)
 * @param {string} userId - Discord user ID of user getting the flashcard
 * @returns {Object} Flashcard
 */
async function getFlashcardByTitle(title, userId){
    try{
        const flashcard = await Flashcard.findOne({title: title, userId: userId});
        return flashcard
    } catch (err){
        console.error("Error getting flashcard: ", err);
        throw err;
    }
}

/**
 * Delete a flashcard by its title
 * @param {string} title - Title of flashcard
 * @param {string} userId - Discord user ID of user deleting flashcard
 * @returns {void}
 */
async function deleteFlashcardByTitle(title, userId){
    try{
        const flashcard = await Flashcard.findOneAndDelete({title: title, userId: userId});
        console.log(`${kleur.red().bold("[DEL]")} ${moment().format("DD-MM-YYYY HH:mm:ss")} User: ${userId} deleted flashcard: ${flashcard._id}`);
    } catch (err){
        console.error("Error deleting flashcard: ", err);
        throw err;
    }
}


 module.exports = {
    createFlashcard,
    getFlashcardByTitle,
    deleteFlashcardByTitle
 }