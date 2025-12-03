const { embedColor } = require("../../components/utility")
const { SlashCommandBuilder, EmbedBuilder, MessageFlags } = require("discord.js");
const { Pagination } = require("pagination.djs")
const { getFlashcards } = require("../../crud/flashcard");


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

        flashcards.sort((a, b) => a.cardCollection.name.localeCompare(b.cardCollection.name));

        const pagination = new Pagination(interaction);
        const embeds = []
        const flashcardsPerPage = 25;

        for(let i = 0; i < flashcards.length; i += flashcardsPerPage){
            const cardChunk = flashcards.slice(i, i + flashcardsPerPage);

            const newEmbed = new EmbedBuilder()
            .setTitle(`Page ${i + 1}`)
            .setColor(embedColor);
            
            let embedDescription = "";

            for(let j = 0; j < cardChunk.length; j++){
                const card = cardChunk[j];
            
                cardDescription = `${j + i + 1} - **Title**: ${card.title} **Collection**: ${card.cardCollection.name}`;
                embedDescription = embedDescription.concat(cardDescription, "\n");
            }
            newEmbed.setDescription(embedDescription);

            embeds.push(newEmbed);
        }
        pagination.setEmbeds(embeds);
        pagination.render();
    },
};
