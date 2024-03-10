import { SlashCommandBuilder } from '@discordjs/builders'
import { GeminiPro as ai } from '../../gemini_pro/index.js'

export const geminiPro = {
  data: new SlashCommandBuilder()
    .setName('geminipro')
    .setDescription('Gemini Pro AI')
    .addStringOption((option) =>
      option
        .setName('prompt')
        .setDescription('Input for Gemini Pro AI')
        .setRequired(true)
    ),
  async execute(interaction) {
    const prompt = interaction.options.getString('prompt')

    // defer reply
    await interaction.deferReply()
    // run the AI
    ai.run(prompt)
      .then((response) => {
        interaction.editReply(response)
      })
      .catch((error) => {
        console.error(error)
        interaction.editReply('There was an error running the AI')
      })
  },
}
