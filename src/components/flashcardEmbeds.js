const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const embedColor = 0xe8d18b;

/**
 * Creates an embed with provided title and reveal content button
 * @param {string} title - Title of flashcard
 * @param {string} interactionId - Unique id for the interaction creating the embed
 * @returns {Object} An object containing the embed and action row (button)
 */
function createRevealEmbed(title, interactionId){
    const embed = new EmbedBuilder()
        .setTitle(title)
        .setColor(embedColor);

    const row = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setCustomId(`toggle-${interactionId}`)
                .setLabel("Reveal Content")
                .setStyle(ButtonStyle.Primary)
        );

    return {embed, row};
}

/**
 * Creates an embed with provided content and hide content button
 * @param {string} content - Content of flashcard
 * @param {string} interactionId - Unique id for interaction creating the embed
 * @returns {Object} An object containing the embed and action row (button)
 */
function createHideEmbed(content, interactionId){
    const embed = new EmbedBuilder()
        .setDescription(content)
        .setColor(embedColor);

    const row = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setCustomId(`toggle-${interactionId}`)
                .setLabel("Hide Content")
                .setStyle(ButtonStyle.Primary)
        );
    
    return {embed, row};
}

module.exports = {
    createRevealEmbed,
    createHideEmbed
}
