const { SlashCommandBuilder, MessageFlags } = require("discord.js");
const { deleteFlashcardByTitle, getFlashcardByTitle } = require("../../crud/flashcard");
const { getCardCollectionByName } = require("../../crud/cardCollection");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("delete_flashcard")
        .setDescription("Delete a flashcard from the bot")
        .addStringOption(option => option
            .setName("collection")
            .setDescription("Collection card belongs to")
            .setRequired(true)
        )
        .addStringOption(option => option
            .setName("title")
            .setDescription("Title of card")
            .setRequired(true)
        ),
    async execute(interaction){
        await interaction.deferReply({flags: MessageFlags.Ephemeral});

        const title = interaction.options.getString("title");
        const collectionName = interaction.options.getString("collection");

        const collection = await getCardCollectionByName(collectionName, interaction.user.id);
        if(!collection){
            await interaction.editReply({content: `Collection with name: **${collectionName}** doesn't exist`});
            return;
        }

        const existingFlashcard = await getFlashcardByTitle(collection, title, interaction.user.id);
        if(!existingFlashcard){
            await interaction.editReply({content: `Flashcard with title: **${title}** doesn't exist`});
            return;
        }

        try{
            await deleteFlashcardByTitle(collection, title, interaction.user.id);
            await interaction.editReply({content: "Flashcard deleted successfully"});
        }
        catch(err){
            await interaction.editReply({content: "Error while deleting your flashcard"});
        }
    },
};