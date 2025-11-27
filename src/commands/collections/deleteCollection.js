const { SlashCommandBuilder, MessageFlags } = require("discord.js");
const { deleteCardCollection, getCardCollectionByName  } = require("../../crud/cardCollection");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("delete_card_collection")
        .setDescription("Deletes a card collection and all associated cards")
        .addStringOption(option => option
            .setName("name")
            .setDescription("Name of collection to delete")
            .setRequired(true)
        ),
    async execute(interaction){
        await interaction.deferReply({flags: MessageFlags.Ephemeral});

        const name = interaction.options.getString("name");

        const cardCollection = await getCardCollectionByName(name, interaction.user.id);
        if(!cardCollection){
            await interaction.editReply({content: `Card collection with name: **${name}** doesn't exist`});
            return;
        }

        await deleteCardCollection(cardCollection, interaction.user.id);
        await interaction.editReply({content: "Card collection deleted successfully"});
    }
}