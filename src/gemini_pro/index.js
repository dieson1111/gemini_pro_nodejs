import { GoogleGenerativeAI } from '@google/generative-ai'

// define the generative AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)

export const GeminiPro = {
  async run(prompt) {
    // validate input
    if (!prompt) {
      throw new Error('Prompt is required')
    }
    // For text-only input, use the gemini-pro model
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' })
    const result = await model.generateContent(prompt)
    const response = result.response
    const text = response.text()
    console.log(text)
    return text
  },
}
