const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');
const db = require('quick.db');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('close')
        .setDescription('Close the ticket'),
    async execute(client, interaction) {
    let closed = db.fetch(`ticket-${interaction.channel.id}_${interaction.guild.id}`)
    if(closed.closed == true) {
      return interaction.reply({ content: `Ticket has already closed...`, ephemeral: true })
    }
    const closeTicket = new MessageEmbed()
    .setDescription(`Ticket Closed by ${interaction.user}`)
    const closeButton = {
        'type': 1,
        'components': [
          {
            'type': 2,
            'style': 'SECONDARY',
            'custom_id': 'transcript',
            'emoji': '📑',
            'label': 'Transcript',
          },
          {
            'type': 2,
            'style': 'SECONDARY',
            'custom_id': 'open',
            'emoji': '🔓',
            'label': 'Open',
          },
          {
            'type': 2,
            'style': 'SECONDARY',
            'custom_id': 'delete',
            'emoji': '⛔',
            'label': 'Delete',
          },
        ]
      }

    const buttonsMsg = await interaction.reply({ embeds: [closeTicket], components: [closeButton] })
    
      interaction.channel.id, {
        permissionOverwrites: [
          {
            id: interaction.user.id,
            deny: ['VIEW_CHANNEL'],
          },
          {
            id: interaction.guild.roles.everyone,
            deny: ['VIEW_CHANNEL'],
          },
        ],
      };

    interaction.channel.permissionOverwrites.edit(closed.user, {
        SEND_MESSAGES: false,
        VIEW_CHANNEL: false,
        ATTACH_FILES: false,
        READ_MESSAGE_HISTORY: false,
    });

    db.set(`ticket-${interaction.channel.id}_${interaction.guild.id}.closed`, true)
    }
}