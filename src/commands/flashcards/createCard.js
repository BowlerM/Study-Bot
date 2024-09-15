const { SlashCommandBuilder } = require("discord.js");
const Flashcard = require("../../models/flashcard");

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
        const title = interaction.options.getString("title");
        const content = interaction.options.getString("content");

        existingFlashcard = await Flashcard.findOne({title: title, userId: interaction.user.id});
        if(existingFlashcard){
            await interaction.reply({content: `Card with title: **${title}** already exists`, ephemeral: true});
            return;
        }

        const flashcard = new Flashcard({
            title: title,
            content: content,
            userId: interaction.user.id
        })

        try{
            await flashcard.save();
            await interaction.reply({content: "Flashcard saved successfully", ephemeral: true});
        }
        catch(err){
            console.error("Error saving flashcard", err);
            await interaction.reply({content: "Error while creating your flashcard", ephemeral: true});
        }
    },
};