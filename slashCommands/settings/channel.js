const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const db = require('quick.db');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('send-channel')
        .setDescription('Set the channel to send the ticket panel')
        .addChannelOption(channel =>
          channel.setName('channel').setDescription('Ticket panel channel')
        ),
    async execute(client, interaction) {
      let channel = interaction.options.getChannel('channel')

      let channelEmbed = new MessageEmbed()
      .setAuthor('Setup >> Ticket Panel Channel', interaction.guild.iconURL())
      .setDescription(`${interaction.user}, you have successfully setted the channel for sending ticket panel to ${channel}`)
      db.set(`ticketPanel_${interaction.guild.id}`, channel.id)
      interaction.reply({ embeds: [channelEmbed] })
    }
}