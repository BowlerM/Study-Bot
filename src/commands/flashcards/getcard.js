const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } = require("discord.js");
const Flashcard = require("../../models/flashcard")
const embedColor = 0xe8d18b

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

        inputTitle = interaction.options.getString("title");
        try{
            const flashcard = await Flashcard.findOne({title: inputTitle, userId: interaction.user.id}).lean();

            if(!flashcard){
                await interaction.editReply({content: `No card with title: **${inputTitle}** found`});
                return;
            }

            const title = flashcard.title;
            const content = flashcard.content;
            
            //TODO: move embeds to different file
            const embed = new EmbedBuilder()
                .setTitle(title)
                .setColor(embedColor);
    
            const row = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId(`toggle-${interaction.id}`)
                        .setLabel("Reveal Answer")
                        .setStyle(ButtonStyle.Primary)
                );
    
                await interaction.editReply({ embeds: [embed], components: [row]})
    
                const collectorFilter = i => i.user.id === interaction.user.id && i.customId.startsWith("toggle-");
                const collector = interaction.channel.createMessageComponentCollector({filter: collectorFilter, time: 600000});
    
                collector.on("collect", async i => {
                    if(i.customId === `toggle-${interaction.id}`){
                        const currentLabel = i.component.label;
    
                        if (currentLabel === "Reveal Answer"){
                            const revealEmbed = new EmbedBuilder()
                                .setDescription(content)
                                .setColor(embedColor);
    
                            const updatedRow = new ActionRowBuilder()
                            .addComponents(
                                new ButtonBuilder()
                                    .setCustomId(`toggle-${interaction.id}`)
                                    .setLabel("Hide Answer")
                                    .setStyle(ButtonStyle.Primary)
                            );
                            await i.update({ embeds: [revealEmbed], components: [updatedRow]});
                        }
                        else if (currentLabel === "Hide Answer"){       
                            const hideEmbed = new EmbedBuilder()
                                .setTitle(title)
                                .setColor(embedColor);
                            
                            const updatedRow = new ActionRowBuilder()
                            .addComponents(
                                new ButtonBuilder()
                                    .setCustomId(`toggle-${interaction.id}`)
                                    .setLabel("Reveal Answer")
                                    .setStyle(ButtonStyle.Primary)
                            );
        
                            await i.update({ embeds: [hideEmbed], components: [updatedRow]});
                        }
                    }
                });
    
                collector.on("end", async collected => {
                    await interaction.editReply({ components: []});
                });
        }
        catch(err){
            console.error("Error getting flashcard", err);
            await interaction.editReply({content: "There was an error getting the flashcard"});
        }
    },
};