const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const db = require('quick.db');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('parent-category')
        .setDescription('Set the parent category of ticket channels')
        .addChannelOption(category =>
          category.setName('category').setDescription('Ticket channels\' parent category')
        ),
    async execute(client, interaction) {
          let category = interaction.options.getChannel('category')

          let categoryEmbed = new MessageEmbed()
          .setAuthor('Setup >> Ticket Channels\' Parent Category', interaction.guild.iconURL())
          .setDescription(`${interaction.user}, you have successfully setted the parent category for ticket channels to ${category}`)
          db.set(`parentCategory_${interaction.guild.id}`, category.id)
          interaction.reply({ embeds: [categoryEmbed] })
    }
}