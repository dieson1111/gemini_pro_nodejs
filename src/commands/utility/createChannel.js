import { SlashCommandBuilder } from '@discordjs/builders'
import { ChannelType } from 'discord.js'

export const createChannel = {
  data: new SlashCommandBuilder()
    .setName('createchannel')
    .setDescription('Create a new channel')
    .addStringOption((option) =>
      option
        .setName('name')
        .setDescription('Name of the channel')
        .setRequired(true)
    ),
  async execute(interaction) {
    const channelName = interaction.options.getString('name')
    await interaction.guild.channels.create(channelName, {
      type: ChannelType.GuildText,
    })
    await interaction.reply(`Channel ${channelName} has been created`)
  },
}
