const { SlashCommandBuilder, MessageFlags } = require("discord.js");
const Flashcard = require("../../models/flashcard");
const { createFlashcard, getFlashcardByTitle } = require("../../crud/flashcard");
const { getCardCollectionByName } = require("../../crud/cardCollection");
const flashcard = require("../../models/flashcard");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("create_flashcard")
        .setDescription("Create a flashcard to save to the bot")
        .addStringOption(option => option
            .setName("collection")
            .setDescription("Card collection to add card to")
            .setRequired(true)
        )
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
        await interaction.deferReply({flags: MessageFlags.Ephemeral});

        const collectionName = interaction.options.getString("collection");
        const title = interaction.options.getString("title");
        const content = interaction.options.getString("content");

        const collection = await getCardCollectionByName(collectionName, interaction.user.id);
        if(!collection){
            await interaction.editReply({content: `Collection with name: **${collectionName}** doesn't exist`});
            return;
        }

        existingFlashcard = await getFlashcardByTitle(collection, title, interaction.user.id)
        if(existingFlashcard){
            await interaction.editReply({content: `Card with title: **${title}** already exists`});
            return;
        }
        
        try{
            await createFlashcard(collection, title, content, interaction.user.id)
            await interaction.editReply({content: "Flashcard saved successfully"});
        }
        catch(err){
            await interaction.editReply({content: "Error while creating your flashcard"});
        }
    },
};