const express = require('express');
const app = express();
const { Client, Collection } = require('discord.js')
const fs = require('fs')
const client = new Client({
    partials: ["MESSAGE", "CHANNEL", "REACTION"],
    intents: 32767,
});

module.exports = client;

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
client.slashCommands = new Collection();
client.categories = fs.readdirSync('./commands');

//load the files
['command', 'slashCommand'].forEach((handler) => {
    require(`./handler/${handler}`)(client)
});


app.listen(8080, () => {
  console.log('Listening on port 8080')
});

app.get('/', (req, res) => {
  res.send(`<h2>Discord.js v13 Quick.db Ticket bot is alive!<h2>`)
});


client.login(token)