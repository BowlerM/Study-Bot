const { SlashCommandBuilder, MessageFlags } = require("discord.js");
const { getCardCollectionByName } = require("../../crud/cardCollection");
const { getFlashcardsFromCollection } = require("../../crud/flashcard");
const { createCollectionEmbed } = require("../../components/collectionEmbeds");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("get_card_collection")
        .setDescription("Shows a card collection and its cards")
        .addStringOption(option => option
            .setName("name")
            .setDescription("Name of the card collection")
            .setRequired(true)
        ),
    async execute(interaction){
        await interaction.deferReply({flags: MessageFlags.Ephemeral});

        const name = interaction.options.getString("name");
        const cardCollection = await getCardCollectionByName(name, interaction.user.id);
        
        const flashcards = await getFlashcardsFromCollection(cardCollection, interaction.user.id);
        
        const embed = createCollectionEmbed(name, flashcards);

        await interaction.editReply({embeds: [embed]});
    }
}