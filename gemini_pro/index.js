import { GoogleGenerativeAI } from "gemini_pro";

// define the generative AI
const api_key = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
