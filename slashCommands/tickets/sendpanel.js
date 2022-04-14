const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');
const db = require('quick.db');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('send-panel')
        .setDescription('Send the ticket panel.'),
    async execute(client, interaction) {
          let channel = db.get(`ticketPanel_${interaction.guild.id}`);
          let category = db.get(`parentCategory_${interaction.guild.id}`);

          let replyEmbed = new MessageEmbed()
          .setAuthor('Ticket >> Ticket Panel Sent!', interaction.guild.iconURL())
          .setDescription(`${interaction.user}, ticket panel has sent to <#${channel}>`)
          interaction.reply({ embeds: [replyEmbed] })

          const embed = new MessageEmbed()
          .setAuthor('Ticket Support', client.user.displayAvatarURL())
          .setDescription('Press the button to create a ticket.')
          .setFooter(client.user.username, client.user.displayAvatarURL())
           const row = new MessageActionRow()
          .addComponents(
            new MessageButton()
            .setCustomId('create-ticket')
            .setLabel('Create ticket')
            .setEmoji('📩')
            .setStyle('PRIMARY'),
          )
          const message = await client.channels.cache.get(channel).send({ embeds: [embed], components: [row] })
    }
}