import { SlashCommandBuilder } from '@discordjs/builders'
import { ChannelType } from 'discord.js'

export const echo = {
  data: new SlashCommandBuilder()
    .setName('echo')
    .setDescription('Replies with your input.')
    .addStringOption((option) =>
      option
        .setName('input')
        .setDescription('The input to echo back')
        .setRequired(true)
        .setMaxLength(200)
    )
    .addChannelOption((option) =>
      option
        .setName('channel')
        .setDescription('The channel to echo the input')
        .addChannelTypes(ChannelType.GuildText)
    )
    .addBooleanOption((option) =>
      option
        .setName('embed')
        .setDescription('Whether or not the echo should be embedded')
    ),
  async execute(interaction) {
    const input = interaction.options.getString('input')
    const channel = interaction.options.getChannel('channel')
    const embed = interaction.options.getBoolean('embed')

    await interaction.reply({
      content: `You said: ${input}`,
      ephemeral: embed ? false : true,
    })

    if (channel) {
      await channel.send(input)
    } else {
      await interaction.reply({
        content: input,
      })
    }
  },
}
