const { DEFAULT_EMBED_COLOR } = require("../../constants/colors")
const { SlashCommandBuilder, EmbedBuilder, MessageFlags } = require("discord.js");
const { Pagination } = require("pagination.djs")
const { getFlashcards } = require("../../crud/flashcard");
const { DISCORD_LIMITS } = require("../../constants/discordLimits");
const { APP_LIMITS } = require("../../constants/appLimits");


module.exports = {
    data: new SlashCommandBuilder()
        .setName("list_all_flashcards")
        .setDescription("Get a list of flashcards that you have saved"),
    async execute(interaction){
        await interaction.deferReply({flags: MessageFlags.Ephemeral});
        
        const flashcards = await getFlashcards(interaction.user.id, {populateCollection: true});
        if(!flashcards){
            await interaction.editReply({content: "You have no flashcards"});
            return;
        }

        //TODO: add a user set language setting to pass into localCompare
        flashcards.sort((a, b) => a.cardCollection.name.localeCompare(b.cardCollection.name));

        const pagination = new Pagination(interaction);
        const embeds = [];

        let currentEmbed = new EmbedBuilder()
                        .setTitle("Page 1")
                        .setColor(DEFAULT_EMBED_COLOR)
        let currentDescription = "";
        let currentCollection = "";
        let pageNum = 1;
        let currentLineCount = 0;
        
        for(let i = 0; i < flashcards.length; i++){
            const flashcard = flashcards[i];

            let line = "";
            if(flashcard.cardCollection.name !== currentCollection){
                currentCollection = flashcard.cardCollection.name;
                line += `▸ **${currentCollection}**\n`;
                currentLineCount++;
            }

            line += `\u200B \u200B \u200B \u200B ▸ ${flashcard.title}\n`;
            currentLineCount++;

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
                currentDescription += line;
            }

        }
        if (currentDescription.length > 0) {
            currentEmbed.setDescription(currentDescription);
            embeds.push(currentEmbed);
        }

        pagination.setEmbeds(embeds);
        pagination.render();
    },
};