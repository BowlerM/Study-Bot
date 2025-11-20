const { SlashCommandBuilder } = require("discord.js");
const { createCardCollection, getCardCollectionByName } = require("../../crud/cardCollection");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("create_card_collection")
        .setDescription("Creates a collection to store flashcards")
        .addStringOption(name => name
            .setName("name")
            .setDescription("Name of collection")
            .setRequired(true)
        ),
    async execute(interaction){
        await interaction.deferReply({flags: MessageFlags.Ephemeral});

        const name = interaction.options.getString("name");
        const existingCardCollection = await getCardCollectionByName(name, interaction.user.id);

        if(existingCardCollection){
            await interaction.editReply({content: `Collection with name: **${name}** already exists`});
            return;
        }
        try{
            await createCardCollection(name, interaction.user.id);
            await interaction.editReply({content: "Card collection saved successfully"});
        }
        catch(err){
            await interaction.editReply({content: "Error while creating a card collection"});
            throw err;
        }
    },
};
