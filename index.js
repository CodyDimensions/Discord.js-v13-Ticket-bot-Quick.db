const keep_alive = require('./keep_alive.js')
const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v9");
const { Client, Message, MessageEmbed, Collection } = require('discord.js')
const fs = require('fs')
var colors = require('colors');
const client = new Client({
    partials: ["MESSAGE", "CHANNEL", "REACTION"],
    intents: 32767,
});


module.exports = client;

const config = require('./config.json')
const prefix = config.prefix
const token = process.env.token

client.on("ready", () => {
  console.log(`Cody Dimensions`.green)
  console.log(`Logged in as ${client.user.tag}`.cyan)
  client.user.setActivity("Cody Dimensions", {
  type: "STREAMING",
  url: "https://www.youtube.com/watch?v=8yRTIieDJXw"
});
});



//new collections
client.commands = new Collection();
client.aliases = new Collection();
client.events = new Collection();

client.categories = fs.readdirSync('./commands');

//load the files
['command'].forEach((handler) => {
    require(`./handler/${handler}`)(client)
});


//slash commands
client.slashCommands = new Collection();

['slashCommand'].forEach((handler) => {
    require(`./handler/${handler}`)(client)
});



client.login(token)