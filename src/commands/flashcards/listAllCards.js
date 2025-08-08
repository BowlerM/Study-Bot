const { embedColor } = require("../../components/utility")
const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { Pagination } = require("pagination.djs")
const { getAllFlashcards } = require("../../crud/flashcard");


module.exports = {
    data: new SlashCommandBuilder()
        .setName("list_all_flashcards")
        .setDescription("Get a list of flashcards that you have saved"),
    async execute(interaction){
        await interaction.deferReply({ephemeral: true});
        
        let flashcards;
        try{            
            flashcards = await getAllFlashcards(interaction.user.id);
            if(!flashcards){
                await interaction.editReply({content: "You have no flashcards"});
                return;
            }
        }
        catch(err){
            await interaction.editReply({content: "There was an error getting the flashcards"});
            return;
        }

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
                cardDescription = `${j + i + 1} - ${cardChunk[j].title}`;
                embedDescription = embedDescription.concat(cardDescription, "\n");
            }
            newEmbed.setDescription(embedDescription);

            embeds.push(newEmbed);
        }
        pagination.setEmbeds(embeds);
        pagination.render();
    },
};
