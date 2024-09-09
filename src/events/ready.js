const { Events } = require('discord.js');
const mongoose = require("mongoose")
const { mongodb_uri } = require("../config.json") 

module.exports = {
	name: Events.ClientReady,
	once: true,
	async execute(client) {
		console.log(`Ready! Logged in as ${client.user.tag}`);

		await mongoose.connect(mongodb_uri);
		console.log("Connected to database")
	},
};