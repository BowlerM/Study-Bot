const { SlashCommandBuilder } = require("discord.js");
const { deleteFlashcardByTitle, getFlashcardByTitle } = require("../../crud/flashcard");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("delete_flashcard")
        .setDescription("Delete a flashcard from the bot")
        .addStringOption(option => option
            .setName("title")
            .setDescription("Title of card")
            .setRequired(true)
        ),
    async execute(interaction){
        await interaction.deferReply({ephemeral: true});
        const title = interaction.options.getString("title");

        const existingFlashcard = await getFlashcardByTitle(title, interaction.user.id);
        if(!existingFlashcard){
            await interaction.editReply({content: `Flashcard with title: **${title}** doesn't exist`});
            return;
        }

        try{
            await deleteFlashcardByTitle(title, interaction.user.id);
            await interaction.editReply({content: "Flashcard deleted successfully"});
        }
        catch(err){
            await interaction.editReply({content: "Error while deleting your flashcard"});
        }
    },
};