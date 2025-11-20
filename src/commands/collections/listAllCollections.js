const { SlashCommandBuilder, MessageFlags } = require("discord.js");
const { getAllCardCollections } = require("../../crud/cardCollection");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("get_all_card_collections")
        .setDescription("Lists all your collections of cards"),
    async execute(interaction){
        await interaction.deferReply({flags: MessageFlags.Ephemeral});

        try{
            const cardCollections = getAllCardCollections(interaction.user.id);
            await interaction.editReply({content: `Card collections ${cardCollections}`});
        }
        catch(err){
            await interaction.editReply({content: "Error occured trying to get all card collections"});
        }
    }
}