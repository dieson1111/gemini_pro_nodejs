import { SlashCommandBuilder } from '@discordjs/builders'
import { GeminiPro as ai } from '../../gemini_pro/index.js'
import { chatHistory } from '../../gemini_pro/chatHistory.js'

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
    const userId = interaction.user.id
    const prompt = interaction.options.getString('prompt')

    // get chat history
    let history = chatHistory.get(userId) ?? []

    // defer reply
    await interaction.deferReply()
    // run the AI
    ai.run(prompt, history)
      .then((response) => {
        if (response.length === 0) {
          throw new Error('No response from the AI')
        }
        interaction.editReply(response)

        // save chat history
        history.push(
          {
            role: 'user',
            parts: prompt,
          },
          {
            role: 'model',
            parts: response,
          }
        )
        chatHistory.set(userId, history)
      })
      .catch((error) => {
        console.error(error)
        interaction.editReply('There was an error running the AI')
      })
  },
}
