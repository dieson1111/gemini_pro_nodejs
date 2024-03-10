import { SlashCommandBuilder } from '@discordjs/builders'
import { PermissionFlagsBits } from 'discord-api-types/v9'

export const kick = {
  data: new SlashCommandBuilder()
    .setName('kick')
    .setDescription('Select a member and kick them.')
    .addUserOption((option) =>
      option
        .setName('target')
        .setDescription('The member to kick')
        .setRequired(true)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers),
  async execute(interaction) {
    const target = interaction.options.getUser('target')
    await interaction.reply(`Kicking ${target.username}`)
    await interaction.guild.members.kick(target)
  },
}
