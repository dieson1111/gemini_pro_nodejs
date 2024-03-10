import { SlashCommandBuilder } from 'discord.js'
import timers from 'node:timers/promises'

export const ping = {
  data: new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Replies with Pong!'),

  async execute(interaction) {
    await interaction.reply('Pong!')
    await interaction.followUp('Pong again!')
  },
}
