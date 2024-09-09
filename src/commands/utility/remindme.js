const { SlashCommandBuilder } = require("discord.js");

module.exports= {
    data: new SlashCommandBuilder()
        .setName("remindme")
        .setDescription("Bot will remind you of your message after specified time")
        .addStringOption(option => option.setName("message").setDescription("Message to be reminded of").setRequired(true))
        .addNumberOption(option => option
            .setName("time")
            .setDescription("In Minutes")
            .setMinValue(0)
            .setMaxValue(525960)
            .setRequired(true)),
    async execute(interaction){
        message = interaction.options.getString("message");
        minutes = interaction.options.getNumber("time");

        await interaction.reply({content: `You will be reminded in ${minutes} minutes`, ephemeral: true});
        
        setTimeout(() =>{
            interaction.followUp({content: message, ephemeral: true});
        }, minutes * 60000);
    },
};