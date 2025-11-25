const { SlashCommandBuilder, MessageFlags } = require("discord.js");
const { createRevealEmbed, createToggleButtonCollector } = require("../../components/flashcardEmbeds");
const { getFlashcardByTitle} = require("../../crud/flashcard");
const { getCardCollectionByName } = require("../../crud/cardCollection");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("get_flashcard")
        .setDescription("Get a flashcard that you have saved")
        .addStringOption(option => option
            .setName("collection")
            .setDescription("Collection card belongs to")
            .setRequired(true)
        )
        .addStringOption(option => option
            .setName("title")
            .setDescription("Title of card you are trying to get")
            .setRequired(true)
        ),
    async execute(interaction){
        await interaction.deferReply({flags: MessageFlags.Ephemeral});
        
        let flashcard; 
        const inputTitle = interaction.options.getString("title");
        const collectionName = interaction.options.getString("collection");


        const collection = await getCardCollectionByName(collectionName, interaction.user.id);
        if(!collection){
            await interaction.editReply({content: `Collection with name: **${collectionName}** doesn't exist`});
            return;
        }

        try{            
            flashcard = await getFlashcardByTitle(collection, inputTitle, interaction.user.id);
            if(!flashcard){
                await interaction.editReply({content: `No card with title: **${inputTitle}** found`});
                return;
            }
        }
        catch(err){
            await interaction.editReply({content: "There was an error getting the flashcard"});
            return;
        }

        const title = flashcard.title;
        const content = flashcard.content;
        
        const {embed, row} = createRevealEmbed(title, interaction.id);

        await interaction.editReply({ embeds: [embed], components: [row]});

        createToggleButtonCollector(interaction, title, content);
    },
};