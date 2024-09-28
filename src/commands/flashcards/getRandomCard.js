const { SlashCommandBuilder } = require("discord.js");
const Flashcard = require("../../models/flashcard")



module.exports = {
    data: new SlashCommandBuilder()
        .setName("get_random_card")
        .setDescription("Get a random card"),
    async execute(interaction){
        await interaction.deferReply({ephemeral: true});
        const flashcardCount = await Flashcard.countDocuments({userId: interaction.user.id});

        if(flashcardCount === 0){
            
        }
    }
}