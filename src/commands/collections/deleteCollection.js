const { SlashCommandBuilder, MessageFlags } = require("discord.js");
const { deleteCardCollection  } = require("../../crud/cardCollection");

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
        try{
            await deleteCardCollection(name, interaction.user.id);
            await interaction.editReply({content: "Card collection deleted successfully"});
        }
        catch(err){
            await interaction.editReply({content: "Error occured when trying to delete a card collection"});
            throw err;
        }
    }
}