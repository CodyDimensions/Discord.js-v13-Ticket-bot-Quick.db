const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const db = require('quick.db');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('transcript-set')
        .setDescription('Set the channel to send transcript & the type of transcript')
        .addChannelOption(channel =>
          channel.setName('channel').setDescription('Transcript channel')
        )
        .addStringOption(type =>
          type.setName('type-of-transcript').setDescription('html or text transcript')
          .addChoice('html', 'html').addChoice('text', 'text')
        ),
    async execute(client, interaction) {
      const channel = interaction.options.getChannel('channel');
      const type = interaction.options.getString('type-of-transcript');

      let channelEmbed = new MessageEmbed()
      .setAuthor('Setup >> Ticket Transcript Settings', interaction.guild.iconURL())
      .setDescription(`${interaction.user}, you have successfully setted the channel for sending ticket transcript to ${channel} and the type of transcript is ${type}`)
      db.set(`ticketTranscript_${interaction.guild.id}`, channel.id)
      db.set(`transcriptType_${interaction.guild.id}`, type)
      interaction.reply({ embeds: [channelEmbed] })
    }
}