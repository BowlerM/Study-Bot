const { SlashCommandBuilder } = require("discord.js");
const { createRevealEmbed, createHideEmbed } = require("../../components/flashcardEmbeds");
const { getFlashcardByTitle } = require("../../crud/flashcard");
const Flashcard = require("../../models/flashcard")


module.exports = {
    data: new SlashCommandBuilder()
        .setName("get_flashcard")
        .setDescription("Get a flashcard that you have saved")
        .addStringOption(option => option
            .setName("title")
            .setDescription("Title of card you are trying to get")
            //TODO: remove required = true to allow user to get all cards by not providing title
            .setRequired(true)
        ),
    async execute(interaction){
        await interaction.deferReply({ephemeral: true});
        
        let flashcard;
        const inputTitle = interaction.options.getString("title");
        try{
            flashcard = await getFlashcardByTitle(inputTitle, interaction.user.id);
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

        await interaction.editReply({ embeds: [embed], components: [row]})

        const collectorFilter = i => i.user.id === interaction.user.id && i.customId.startsWith("toggle-");
        const collector = interaction.channel.createMessageComponentCollector({filter: collectorFilter, time: 600000});

        collector.on("collect", async i => {
            if(i.customId === `toggle-${interaction.id}`){
                const currentLabel = i.component.label;

                if (currentLabel === "Reveal Content"){
                    const {embed, row} = createHideEmbed(content, interaction.id);
                    await i.update({ embeds: [embed], components: [row]});
                }
                else if (currentLabel === "Hide Content"){       
                    const {embed, row} = createRevealEmbed(title, interaction.id);
                    await i.update({ embeds: [embed], components: [row]});
                }
            }
        });
        collector.on("end", async collected => {
            await interaction.editReply({ components: []});
        });
    },
};