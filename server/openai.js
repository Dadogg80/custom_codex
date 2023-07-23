import { openai } from './config.js';

async function generateResponse(prompt) {
  try {
    const response = await openai.createCompletion({
      model: "gpt-4",
      prompt: `${prompt}`,
      temperature: 0.2,
      max_tokens: 3500,
      top_p: 1,
      frequency_penalty: 0.5,
      presence_penalty: 0,
    });

    return response;
  } catch (err) {
    console.error(err);
    throw new Error('Failed to generate response from OpenAI');
  }
}

export { generateResponse };
