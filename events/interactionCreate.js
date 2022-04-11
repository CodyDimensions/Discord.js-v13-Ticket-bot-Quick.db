const { Client, Collection } = require('discord.js');
const client = require('..');
const { SlashCommandBuilder } = require('@discordjs/builders');

client.on('interactionCreate', async interaction => {
	if (!interaction.isCommand()) return;
	const slashCommand = client.slashCommands.get(interaction.commandName);
	if (!slashCommand) return;
	try {
		await slashCommand.execute(client, interaction);
	} catch (error) {
		if (error) console.error(error);
		await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
	}
});