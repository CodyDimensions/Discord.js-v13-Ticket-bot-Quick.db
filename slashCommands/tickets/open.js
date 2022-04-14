const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');
const db = require('quick.db');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('open')
        .setDescription('Open the ticket'),
    async execute(client, interaction) {
      let closed = await db.fetch(`ticket-${interaction.channel.id}_${interaction.guild.id}`)
  
      if(closed.closed == false) {
        return interaction.reply({ content: `Ticket has already opened...`, ephemeral: true })
      }
      let reopen = new MessageEmbed()
      .setDescription(`Ticket Opened by ${interaction.user}`)
      interaction.reply({ embeds: [reopen] })
      interaction.channel.permissionOverwrites.edit(closed.user, {
          SEND_MESSAGES: true,
          VIEW_CHANNEL: true,
          ATTACH_FILES: true,
          READ_MESSAGE_HISTORY: true,
      });
      db.set(`ticket-${interaction.channel.id}_${interaction.guild.id}.closed`, false)
    }
}