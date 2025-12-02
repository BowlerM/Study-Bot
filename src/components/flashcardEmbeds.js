const { embedColor } = require("./utility.js")
const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");

/**
 * Creates an embed with provided title and reveal content button
 * @param {string} title Title of flashcard
 * @param {string} interactionId Unique id for the interaction creating the embed
 * @returns {{embed: EmbedBuilder, row: ActionRowBuilder}} An object containing the embed and action row (button)
 */
function createFlashcardRevealEmbed(title, interactionId){
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
 * @param {string} content Content of flashcard
 * @param {string} interactionId Unique id for interaction creating the embed
 * @returns {{embed: EmbedBuilder, row: ActionRowBuilder}} An object containing the embed and action row (button)
 */
function createFlashcardHideEmbed(content, interactionId){
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

/**
 * Creates a collector to handle button presses on a flashcard embed
 * @param {import("discord.js").Interaction} interaction 
 * @param {string} title 
 * @param {string} content 
 * @returns {void}
 */
function createFlashcardToggleButtonCollector(interaction, title, content){
    const collectorFilter = i => i.user.id === interaction.user.id && i.customId.startsWith("toggle-");
    const collector = interaction.channel.createMessageComponentCollector({ filter: collectorFilter, time: 600000 });

    collector.on("collect", async i => {
        if (i.customId === `toggle-${interaction.id}`) {
            const currentLabel = i.component.label;

            if (currentLabel === "Reveal Content") {
                const { embed, row } = createFlashcardHideEmbed(content, interaction.id);
                await i.update({ embeds: [embed], components: [row] });
            } else if (currentLabel === "Hide Content") {
                const { embed, row } = createFlashcardRevealEmbed(title, interaction.id);
                await i.update({ embeds: [embed], components: [row] });
            }
        }
    });

    collector.on("end", async collected => {
        await interaction.editReply({ components: [] });
    });
};

module.exports = {
    createFlashcardRevealEmbed,
    createFlashcardHideEmbed,
    createFlashcardToggleButtonCollector
};