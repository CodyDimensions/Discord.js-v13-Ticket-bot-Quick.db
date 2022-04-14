const client = require('..');
const Discord = require('discord.js');
const { MessageEmbed, MessageActionRow, MessageButton, MessageAttachment } = require("discord.js");
const db = require('quick.db');
const discordTranscripts = require('discord-html-transcripts');
const moment = require('moment');

client.on('interactionCreate', async interaction => {
	if (!interaction.isButton()) return;
  
  let channel = db.fetch(`ticketPanel_${interaction.guildId}`);
  let staff = db.fetch(`staffs_${interaction.guild.id}`);
  let category = db.fetch(`parentCategory_${interaction.guildId}`);

  let Data = db.fetch(`ticketCount_${interaction.guildId}`)
  if(Data == null) Data = 0;
  
  if(interaction.customId === 'create-ticket') {
    await interaction.reply({ content: `Creating ticket, please wait...`, ephemeral: true })
    
      const ticket = await interaction.guild.channels.create(`ticket-${Data}-${interaction.user.username}`, {
        parent: category,
        permissionOverwrites: [
          {
            id: interaction.user.id,
            allow: ['SEND_MESSAGES', 'VIEW_CHANNEL'],
          },
          {
            id: interaction.guild.roles.everyone,
            deny: ['VIEW_CHANNEL'],
          },
        ],
        type: 'text',
      });

    db.add(`ticketCount_${interaction.guildId}`, 1)
    db.set(`ticket-${ticket.id}_${interaction.guild.id}`, {
      user: interaction.user.id,
      closed: false
    })
    await interaction.editReply({ content: `Ticket created ${ticket}`, ephemeral: true })


    const welcomeTicket = new MessageEmbed()
    .setAuthor('Ticket Support', client.user.displayAvatarURL())
    .setDescription('Support will be with you shortly.\nTo close this ticket react with 🔒')
    .setFooter(client.user.username, client.user.displayAvatarURL())
    const closeButton = new MessageActionRow()
    .addComponents(
      new MessageButton()
      .setCustomId('close-ticket')
      .setLabel('Close')
      .setEmoji('🔒')
      .setStyle('SECONDARY'),
    )
    const welcome = await client.channels.cache.get(ticket.id).send({ content: `${interaction.user} Welcome`, embeds: [welcomeTicket], components: [closeButton] })
  }


  if(interaction.customId === 'close-ticket') {
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


  if(interaction.customId === 'open') {
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


  if(interaction.customId === 'delete') {
    interaction.reply({ embeds: [
      new MessageEmbed()
      .setDescription('Ticket will be deleted in a few seconds')
    ] });

    setTimeout(() => {
      interaction.channel.delete();
    }, 5000)
    db.delete(`ticket-${interaction.channel.id}_${interaction.guild.id}`)
    
    const transcriptType = await db.fetch(`transcriptType_${interaction.guild.id}`);
    const transcriptChannel = await db.fetch(`ticketTranscript_${interaction.guild.id}`);
    
    if(transcriptType === 'html') {
    const attachment = await discordTranscripts.createTranscript(interaction.channel);
    await client.channels.cache.get(transcriptChannel).send({ content: `**Ticket Transcript - ${interaction.channel.name}**`, files: [attachment] });
    } else if(transcriptType === 'text') {
        let messages = await interaction.channel.messages.fetch();
        messages = messages.map(m => moment(m.createdTimestamp).format("YYYY-MM-DD hh:mm:ss") +" | "+ m.author.tag + ": " + m.cleanContent).join("\n") || "No messages were in the ticket/Failed logging transcript!";
        const txt = new MessageAttachment(Buffer.from(messages), `transcript_${interaction.channel.id}.txt`)
       client.channels.cache.get(transcriptChannel).send({ content: `**Ticket Transcript - ${interaction.channel.name}**`, files: [txt] })
    } else {
      return;
    }
    
  }


  if(interaction.customId === 'transcript') {
    const transcriptType = await db.fetch(`transcriptType_${interaction.guild.id}`);
    const transcriptChannel = await db.fetch(`ticketTranscript_${interaction.guild.id}`);
    if(transcriptType === 'html') {
    const attachment = await discordTranscripts.createTranscript(interaction.channel);
    await client.channels.cache.get(transcriptChannel).send({ content: `**Ticket Transcript - ${interaction.channel.name}**`, files: [attachment] });
        interaction.reply({ embeds: [
          new MessageEmbed()
          .setDescription(`Ticket transcript sent to <#${transcriptChannel}>!`)
        ] });
    } else if(transcriptType === 'text') {
        let messages = await interaction.channel.messages.fetch();
        messages = messages.map(m => moment(m.createdTimestamp).format("YYYY-MM-DD hh:mm:ss") +" | "+ m.author.tag + ": " + m.cleanContent).join("\n") || "No messages were in the ticket/Failed logging transcript!";
        const txt = new MessageAttachment(Buffer.from(messages), `transcript_${interaction.channel.id}.txt`)
       client.channels.cache.get(transcriptChannel).send({ content: `**Ticket Transcript - ${interaction.channel.name}**`, files: [txt] })
       interaction.reply({ embeds: [
          new MessageEmbed()
          .setDescription(`Ticket transcript sent to <#${transcriptChannel}>!`)
        ] });
    } else {
      return;
    }

  }
});
