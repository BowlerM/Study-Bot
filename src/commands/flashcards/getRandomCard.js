const { SlashCommandBuilder } = require("discord.js");
const Flashcard = require("../../models/flashcard");
const { createToggleButtonCollector, createRevealEmbed } = require("../../components/flashcardEmbeds");
const { getRandomCard } = require("../../crud/flashcard")


//TODO: could possibly use subcommand with getCard to allow a random option instead of 2 seperate commands
module.exports = {
    data: new SlashCommandBuilder()
        .setName("get_random_card")
        .setDescription("Get a random card"),
    async execute(interaction){
        await interaction.deferReply({ephemeral: true});
        let randomCard;
        try{            
            randomCard = await getRandomCard(interaction.user.id)
            if (!randomCard){
                await interaction.editReply({content: "You dont have any cards"});
                return;
            }
        }catch(err){
            await interaction.editReply({content: "There was an error getting the card"});
            return;
        }
        const title = randomCard.title;
        const content = randomCard.content;
        
        const {embed, row} = createRevealEmbed(title, interaction.id);

        await interaction.editReply({ embeds: [embed], components: [row]});
        
        createToggleButtonCollector(interaction, title, content);

    }
}