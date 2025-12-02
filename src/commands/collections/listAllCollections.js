const { embedColor } = require("../../components/utility")
const { SlashCommandBuilder, MessageFlags, EmbedBuilder, EntryPointCommandHandlerType } = require("discord.js");
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
        const embeds = []
        const collectionsPerPage = 25;
        
        for(let i = 0; i < cardCollections.length; i += collectionsPerPage){
            const collectionChunk = cardCollections.slice(i, i + collectionsPerPage);

            const newEmbed = new EmbedBuilder()
            .setTitle(`Page ${i + 1}`)
            .setColor(embedColor);
            
            let embedDescription = "";
            for(let j = 0; j < collectionChunk.length; j++){
                const collection = collectionChunk[j];
                const numOfCards = await getCardCountForCollection(collection, interaction.user.id);

                collectionDescription = `${j + i + 1} - ${collection.name} (${numOfCards} Flashcards)`;
                embedDescription = embedDescription.concat(collectionDescription, "\n");
            }
            newEmbed.setDescription(embedDescription);

            embeds.push(newEmbed);
        }
        pagination.setEmbeds(embeds);
        pagination.render();
    }
}