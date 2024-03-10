import { SlashCommandBuilder } from '@discordjs/builders'

export const echo = {
  data: new SlashCommandBuilder()
    .setName('echo')
    .setDescription('Replies with your input.')
    .addStringOption(
      (option) =>
        option.setName('input').setDescription('The input to echo back')
      // .setRequired(true)
    )
    .addChannelOption((option) =>
      option.setName('channel').setDescription('The channel to echo the input')
    ),
}
