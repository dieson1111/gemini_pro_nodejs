import { SlashCommandBuilder } from '@discordjs/builders'

export const guide = {
  data: new SlashCommandBuilder()
    .setName('guide')
    .setDescription('Search discordjs.guide!')
    .addStringOption((option) =>
      option
        .setName('query')
        .setDescription('Phrase to search for')
        .setAutocomplete(true)
    )
    .addStringOption((option) =>
      option
        .setName('version')
        .setDescription('Version to search in')
        .setAutocomplete(true)
    ),
  async autocomplete(interaction) {
    const focusedOption = interaction.options.getFocused(true)
    let choices

    if (focusedOption.name === 'query') {
      choices = [
        'Popular Topics: Threads',
        'Sharding: Getting started',
        'Library: Voice Connections',
        'Interactions: Replying to slash commands',
        'Popular Topics: Embed preview',
      ]
    }

    if (focusedOption.name === 'version') {
      choices = ['v9', 'v11', 'v12', 'v13', 'v14']
    }

    const filtered = choices.filter((choice) =>
      choice.startsWith(focusedOption.value)
    )
    await interaction.respond(
      filtered.map((choice) => ({ name: choice, value: choice }))
    )
  },
  async execute(interaction) {
    const query = interaction.options.getString('query')
    const version = interaction.options.getString('version')

    await interaction.reply(
      `https://discordjs.guide/${version ? `${version}/` : ''}${
        query ? `search?q=${query}` : ''
      }`
    )
  },
}
