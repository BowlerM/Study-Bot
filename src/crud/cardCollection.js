const CardCollection = require("../models/cardCollection");
const Flashcard = require("../models/flashcard");
const { getOrCreateUser } = require("../crud/user");

const kleur = require('kleur');
const moment = require("moment");

/**
 * 
 * @param {string} name Name of collection
 * @param {string} discordId User's discord ID
 * @returns {Promise<CardCollection|null>} Resolves to card collection or null if not found
 */
async function getCardCollectionByName(name, discordId){
    const user = await getOrCreateUser(discordId);
    const cardCollection = await CardCollection.findOne({name: name, owner: user});
    return cardCollection;
}

/**
 * Returns all of a users card collections
 * @param {string} discordId User's discord ID
 * @returns {Promise<CardCollection[]>}
 */
async function getAllCardCollections(discordId){
    const user = await getOrCreateUser(discordId);
    const cardCollections = await CardCollection.find({owner: user});
    return cardCollections;
}

/**
 * Creates a collection for flashcards
 * @param {string} name Name of the collection
 * @param {string} discordId User's discord ID
 * @returns {Promise<CardCollection>} Resolves to created card collection
 */
async function createCardCollection(name, discordId){
    const user = await getOrCreateUser(discordId);

    const cardCollection = new CardCollection({
        name: name,
        owner: user,
        flashcards: []
    });

    await cardCollection.save();
    console.log(`${kleur.green().bold("[PUT]")} ${moment().format("DD-MM-YYYY HH:mm:ss")} User: ${discordId} created colection: ${cardCollection._id}`);
    return cardCollection;

}

/**
 * Delete a collection of flashcards
 * @param {CardCollection} cardCollection Collection to be deleted
 * @param {string} discordId User's discord ID
 * @returns {void}
 */
async function deleteCardCollection(cardCollection, discordId){
    const user = await getOrCreateUser(discordId);

    await Flashcard.deleteMany({cardCollection: cardCollection._id, owner: user});

    await cardCollection.deleteOne();
    console.log(`${kleur.red().bold("[DEL]")} ${moment().format("DD-MM-YYYY HH:mm:ss")} User: ${discordId} deleted collection: ${cardCollection._id}`);
}

/**
 * 
 * @param {CardCollection} cardCollection Collection to be queried against
 * @param {string} discordId User's discord ID
 * @returns {number} Number of cards in the collection
 */
async function getCardCountForCollection(cardCollection, discordId){
    const user = await getOrCreateUser(discordId);

    const count = await Flashcard.countDocuments({cardCollection: cardCollection, owner: user});
    return count;
}


module.exports = {
    getCardCollectionByName,
    getAllCardCollections,
    getCardCountForCollection,
    createCardCollection,
    deleteCardCollection
};