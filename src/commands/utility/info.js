import { SlashCommandBuilder } from '@discordjs/builders'

export const info = {
  data: new SlashCommandBuilder()
    .setName('info')
    .setDescription('Get info about a user or a server!')
    .addSubcommand((subcommand) =>
      subcommand
        .setName('user')
        .setDescription('Info about a user')
        .addUserOption((option) =>
          option.setName('target').setDescription('The user')
        )
    )
    .addSubcommand((subcommand) =>
      subcommand.setName('server').setDescription('Info about the server')
    ),
  async execute(interaction) {
    if (interaction.options.getSubcommand() === 'user') {
      const user = interaction.options.getUser('target')
      if (user) {
        return interaction.reply(`Username: ${user.username}\nID: ${user.id}`)
      } else {
        return interaction.reply({
          content: `Your username: ${interaction.user.username}\nYour ID: ${interaction.user.id}`,
          ephemeral: true,
        })
      }
    } else if (interaction.options.getSubcommand() === 'server') {
      return interaction.reply({
        content: `Server name: ${interaction.guild.name}\nTotal members: ${interaction.guild.memberCount}`,
        ephemeral: true,
      })
    }
  },
}
