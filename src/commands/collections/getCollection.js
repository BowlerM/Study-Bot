const { SlashCommandBuilder } = require("discord.js");
const { getCardCollectionByName } = require("../../crud/cardCollection");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("get_card_collection")
        .setDescription("Shows a card collection and its cards")
        .addStringOption(name => name
            .setName("name")
            .setDescription("Name of the card collection")
            .setRequired(true)
        ),
    async execute(interaction){
        await interaction.deferReply({flags: MessageFlags.Ephemeral});

        const name = interaction.options.getString("name");
        try{
            const cardCollection = await getCardCollectionByName(name, interaction.user.id);
            
            //TODO: create an embed to display all the information
            await interaction.editReply({content: `Collection cards ${cardCollection.flashcards}`});
        }
        catch(err){
            await interaction.editReply({content: "Error getting the collection"});
            throw err;
        }
    }
}