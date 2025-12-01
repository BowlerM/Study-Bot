const { embedColor } = require("./utility.js")
const { EmbedBuilder } = require("discord.js");

/**
 * 
 * @param {string} name Collection name
 * @param {Flashcard[]} flashcards Array of flashcards in collection
 * @returns {EmbedBuilder} Embed for the collection
 */
function createCollectionEmbed(name, flashcards){
    let collectionDescription;

    if(!flashcards || flashcards.length === 0){
        collectionDescription = "No flashcards in this collection"
    }
    else{
        collectionDescription = `**${flashcards.length}** Flashcard${flashcards.length !== 1 ? "s" : ""} in collection:\n`;

        collectionDescription += flashcards
            .slice(0,10)
            .map((card, i) => `**${i+1}**. ${card.title}`)
            .join("\n");
        
        if (flashcards.length > 10){
            collectionDescription += ".\n.\n.";
        }
    }


    const embed = new EmbedBuilder()
        .setTitle(name)
        .setColor(embedColor)
        .setDescription(collectionDescription);

    
    return embed;
}

module.exports = {
    createCollectionEmbed
};