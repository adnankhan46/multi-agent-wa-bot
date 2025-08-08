import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

async function getAIResponse(prompt) {
  try {
    const response = await axios.post(
      'https://api.groq.com/openai/v1/chat/completions',
      {
        model: 'llama3-70b-8192', // or any other model you want
        messages: [
          { role: 'system', content: 'You are a helpful assistant.' },
          { role: 'user', content: prompt }
        ]
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );
    console.log("Res : ",response.data.choices[0].message.content.trim())
    return response.data.choices[0].message.content.trim();
  } catch (error) {
    console.error('❌ Error calling Groq API:', error.response?.data || error.message);
    return 'Sorry, I had trouble fetching a response from the AI.';
  }
}

getAIResponse("Hello");