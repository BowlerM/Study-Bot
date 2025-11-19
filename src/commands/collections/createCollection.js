const { SlashCommandBuilder } = require("discord.js");
const cardCollection = require("../../models/cardCollection");
const { createCardCollection, getCardCollectionByName } = require("../../crud/cardCollection");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("create_collection")
        .setDescription("Creates a collection to store flashcards")
        .addStringOption(name => name
            .setName("name")
            .setDescription("Name of collection")
            .setRequired(true)
        ),
    async execute(interaction){
        await interaction.deferReply({ephemeral: true});

        const name = interaction.options.getString("name");
        const existingCardCollection = getCardCollectionByName(name);

        if(existingCardCollection){
            await interaction.editReply({content: `Colelction with name: **${name}** already exists`});
            return;
        }

        try{
            await createCardCollection(name, interaction.user.id);
            await interaction.editReply({content: "Card collection saved successfully"});
        }
        catch{
            await interaction.editReply({content: "Error while creating a card collection"});
        }
    },
};
