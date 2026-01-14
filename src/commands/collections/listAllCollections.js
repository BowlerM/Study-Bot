const { DEFAULT_EMBED_COLOR } = require("../../constants/colors")
const { SlashCommandBuilder, MessageFlags, EmbedBuilder } = require("discord.js");
const { DISCORD_LIMITS } = require("../../constants/discordLimits");
const { APP_LIMITS } = require("../../constants/appLimits");
const { getAllCardCollections, getCardCountForCollection } = require("../../crud/cardCollection");
const { Pagination } = require("pagination.djs");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("list_all_card_collections")
        .setDescription("Lists all your collections of cards"),
    async execute(interaction){
        await interaction.deferReply({flags: MessageFlags.Ephemeral});
        
        const cardCollections = await getAllCardCollections(interaction.user.id);

        if(!cardCollections || cardCollections.length === 0){
            await interaction.editReply({content: "You do not have any card colletions"});
            return;
        }

        const pagination = new Pagination(interaction);
        const embeds = [];

        let currentEmbed = new EmbedBuilder()
            .setTitle("Page 1")
            .setColor(DEFAULT_EMBED_COLOR);
        let currentDescription = "";
        let currentLineCount = 0;
        let pageNum = 1;

        for(let i = 0; i < cardCollections.length; i++){
            const cardCollection = cardCollections[i];
            const numOfCards = await getCardCountForCollection(cardCollection, interaction.user.id);

            const line = `${i + 1} - ${cardCollection.name} (${numOfCards} Flashcards)\n`;
            currentLineCount++;

            //Dont let embed description surpass discords length restraint or app defined line count
            const exceedsChars = (currentDescription.length + line.length) > DISCORD_LIMITS.EMBED.DESCRIPTION_LENGTH;
            const exceedsLines = currentLineCount > APP_LIMITS.EMBED.MAX_LINE_COUNT;

            if(exceedsChars || exceedsLines){
                currentEmbed.setDescription(currentDescription);
                embeds.push(currentEmbed);

                pageNum++;
                currentEmbed = new EmbedBuilder()
                            .setTitle(`Page ${pageNum}`)
                            .setColor(DEFAULT_EMBED_COLOR);
                currentDescription = line;
                currentLineCount = 1;
                
            }
            else{
                currentDescription += line
            }
        }

        if(currentDescription.length > 0){
            currentEmbed.setDescription(currentDescription);
            embeds.push(currentEmbed);
        }
            
        pagination.setEmbeds(embeds);
        pagination.render();
    }
}