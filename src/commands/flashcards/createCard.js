const { SlashCommandBuilder } = require("discord.js");
const Flashcard = require("../../models/flashcard");
const { createFlashcard, getFlashcardByTitle } = require("../../crud/flashcard");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("create_flashcard")
        .setDescription("Create a flashcard to save to the bot")
        .addStringOption(option => option
            .setName("title")
            .setDescription("Title of card")
            .setRequired(true)
        )
        .addStringOption(option => option
            .setName("content")
            .setDescription("Content of the card")
            .setRequired(true)
        ),
    async execute(interaction){
        await interaction.deferReply({ephemeral: true});

        const title = interaction.options.getString("title");
        const content = interaction.options.getString("content");

        existingFlashcard = await getFlashcardByTitle(title, interaction.user.id)
        if(existingFlashcard){
            await interaction.editReply({content: `Card with title: **${title}** already exists`});
            return;
        }
        
        try{
            await createFlashcard(title, content, interaction.user.id)
            await interaction.editReply({content: "Flashcard saved successfully"});
        }
        catch(err){
            await interaction.editReply({content: "Error while creating your flashcard"});
        }
    },
};