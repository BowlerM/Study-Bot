const CardCollection = require("../models/cardCollection");
const Flashcard = require("../models/flashcard");
const { getOrCreateUser } = require("../crud/user");

const kleur = require('kleur');
const moment = require("moment");

/**
 * 
 * @param {string} name Name of collection
 * @param {string} discordId User's discord ID
 * @returns {Object} Card collection
 */
async function getCardCollectionByName(name, discordId){
    const user = await getOrCreateUser(discordId);

    try{
        const cardCollection = await CardCollection.findOne({name: name, owner: user});
        return cardCollection;
    }
    catch(err){
        console.error("Error getting a card collection", err);
        throw err;
    }
}

/**
 * Returns all of a users card collections
 * @param {String} discordId User's discord ID
 * @returns {Array}
 */
async function getAllCardCollections(discordId){
    const user = await getOrCreateUser(discordId);

    try{
        const cardCollections = await CardCollection.find({owner: user});
        return cardCollections;
    }
    catch(err){
        console.error("Error getting all card collections", err);
        throw err;
    }
}

/**
 * Creates a collection for flashcards
 * @param {string} name Name of the collection
 * @param {string} discordId User's discord ID
 * @returns {Object} Created collection
 */
async function createCardCollection(name, discordId){
    const user = await getOrCreateUser(discordId);

    try{
        const cardCollection = new CardCollection({
            name: name,
            owner: user,
            flashcards: []
        });

        await cardCollection.save();
        console.log(`${kleur.green().bold("[PUT]")} ${moment().format("DD-MM-YYYY HH:mm:ss")} User: ${discordId} created colection: ${cardCollection._id}`);
        return cardCollection;
    }
    catch(err){
        console.error("Error creating a card collection", err);
        throw err;
    }
}

/**
 * Delete a collection of flashcards
 * @param {string} name Name of the collection
 * @param {string} discordId User's discord ID
 * @returns {void}
 */
async function deleteCardCollection(name, discordId){
    try{
        const cardCollection = await getCardCollectionByName(name, discordId);

        await Flashcard.deleteMany({cardCollection: cardCollection._id});

        await cardCollection.deleteOne();
        console.log(`${kleur.red().bold("[DEL]")} ${moment().format("DD-MM-YYYY HH:mm:ss")} User: ${discordId} deleted collection: ${cardCollection._id}`);
    }
    catch(err){
        console.error("Error deleting a card collection", err);
        throw err;
    }
}


module.exports = {
    getCardCollectionByName,
    getAllCardCollections,
    createCardCollection,
    deleteCardCollection
}