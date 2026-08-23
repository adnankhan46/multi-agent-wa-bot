const axios = require('axios');
const { models, toolModelMapping } = require('../config/models.js');

class AIService {
  constructor() {
    this.groqApiKey = process.env.GROQ_API_KEY; // thankyou Groq bhai
  }

  // Get model config for a specific tool
  getModelForTool(toolHandler) {
    const modelKey = toolModelMapping[toolHandler] || 'GENERAL_CHAT';
    return models[modelKey];
  }

  // Generic AI response with model selection
  async getAIResponse(prompt, chatId, client, getChatHistory, toolHandler = 'handleNormalChat', includeHistory = true) {
    const modelConfig = this.getModelForTool(toolHandler);
    
    console.log(`[INFO] Using model: ${modelConfig.name} for ${toolHandler}`);

    let fullPrompt = prompt;
    
    if (includeHistory) {
      const chatHistory = await getChatHistory(client, chatId);
      const { newSystemPrompt } = require('../config/newPrompt.js');
      
      fullPrompt = `
      ${newSystemPrompt}
      ------------------------------------------------
      Here is the recent chat history:
${chatHistory}
      `;
    }

    try {
      if (modelConfig.provider === 'groq') {
        return await this.callGroqAPI(fullPrompt, prompt, modelConfig);
      } // other provdier
    } catch (error) {
      console.error(`x | Error with ${modelConfig.name}:`, error);
      // Fallback to a simpler model
      return await this.callGroqAPI(fullPrompt, prompt, models.TOOL_SELECTOR);
    }
  }

  async callGroqAPI(systemPrompt, userPrompt, modelConfig) {
    const response = await axios.post(
      'https://api.groq.com/openai/v1/chat/completions',
      {
        model: modelConfig.name,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        max_tokens: modelConfig.maxTokens,
        temperature: modelConfig.temperature
      },
      {
        headers: {
          'Authorization': `Bearer ${this.groqApiKey}`,
          'Content-Type': 'application/json'
        }
      }
    );

    return response.data.choices[0].message.content.trim();
  }


  // tool selection
  async selectTool(userMessage, hasMedia, hasQuoted, mediaType) {
    const tools = require('../config/tools.js');

    const toolList = Object.keys(tools).map(key => 
      `${key}: ${tools[key].description}`
    ).join('\n');

    const contextInfo = `
Context:
- Has media attachment: ${hasMedia}
- Has quoted message: ${hasQuoted}
- Media type: ${mediaType || 'none'}
`;

    const modelConfig = this.getModelForTool('toolSelection');
    console.log("MODEL COfig::", modelConfig)
    try {
      const response = await this.callGroqAPI(
        `You are a tool selector for a WhatsApp AI assistant. Given a user message and context, select the MOST APPROPRIATE tool.

Available tools:
${toolList}

${contextInfo}

SELECTION RULES:
3. If user wants to "summarize" quoted text then SUMMARIZE
4. If user asks about current events, weather, news, "search", "look up" then WEB_SEARCH
8. For general conversation, questions, explanations, or roasting then NORMAL_CHAT

MUST: Respond with ONLY the tool name (e.g., "NORMAL_CHAT"), nothing else.`,
        `Message: "${userMessage}"`,
        modelConfig
      );

      const selectedTool = response.trim();
      console.log("TOOL given:", selectedTool)
      return tools[selectedTool] || tools.NORMAL_CHAT;
    } catch (error) {
      console.error('x | Error selecting tool:', error);
      return tools.NORMAL_CHAT;
    }
  }
}

module.exports = AIService;
