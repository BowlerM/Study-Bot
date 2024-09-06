const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } = require("discord.js");
const embedColor = 0xe8d18b

module.exports = {
    data: new SlashCommandBuilder()
        .setName("get_flashcard")
        .setDescription("Get a flashcard that you have saved"),
    async execute(interaction){
        //example card for now until database setup
        //TODO: setup db
        const title = "Title";
        const content = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean scelerisque dui vitae efficitur fermentum. Quisque eget convallis magna, nec scelerisque odio. Vivamus metus risus, feugiat eu justo in, dignissim porttitor metus. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Curabitur pretium viverra tempus. Interdum et malesuada fames ac ante ipsum primis in faucibus.";

        const embed = new EmbedBuilder()
            .setTitle(title)
            .setColor(embedColor);

        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId("toggle")
                    .setLabel("Reveal Answer")
                    .setStyle(ButtonStyle.Primary)
            );

            await interaction.reply({ embeds: [embed], components: [row], ephemeral: true})

            const collectorFilter = i => i.user.id === interaction.user.id;
            const collector = interaction.channel.createMessageComponentCollector({fitler: collectorFilter, time: 600000});

            collector.on("collect", async i => {
                if(i.customId === "toggle"){
                    const currentLabel = i.component.label;

                    if (currentLabel === "Reveal Answer"){
                        const revealEmbed = new EmbedBuilder()
                            .setDescription(content)
                            .setColor(embedColor);

                        const updatedRow = new ActionRowBuilder()
                        .addComponents(
                            new ButtonBuilder()
                                .setCustomId("toggle")
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
                                .setCustomId("toggle")
                                .setLabel("Reveal Answer")
                                .setStyle(ButtonStyle.Primary)
                        );
    
                        await i.update({ embeds: [hideEmbed], components: [updatedRow]});
                    }
                }
            });

            collector.on("end", collected => {
                interaction.editReply({ components: []});
            });
    },
};