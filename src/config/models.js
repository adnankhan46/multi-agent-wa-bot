const models = {
  // Fast, cheap -> ThankYou GroqAI
  TOOL_SELECTOR: {
    name: 'openai/gpt-oss-20b',
    provider: 'groq',
    description: 'Fast model for tool selection',
    maxTokens: 100,
    temperature: 0.1
  },
  
  // Lightweight
  SUMMARIZER: {
    name: 'llama3-8b-8192',
    provider: 'groq',
    description: 'Efficient for summarization',
    maxTokens: 200,
    temperature: 0.3
  },

  // Web
  WEB_SEARCH: {
    name: 'compound-beta-mini',
    provider: 'groq',
    description: 'For Web search',
    maxTokens: 200,
    temperature: 0.3
  },
  
  GENERAL_CHAT: {
    name: 'openai/gpt-oss-120b',
    provider: 'groq',
    description: 'Best model for general conversations',
    maxTokens: 1200,
    temperature: 0.4
  },
  
};

// Tool-to-model mapping
const toolModelMapping = { 
  'handleSummarize': 'SUMMARIZER',
  'handleWebSearch': 'WEB_SEARCH',
  'handleNormalChat': 'GENERAL_CHAT',
  'toolSelection': 'TOOL_SELECTOR'
};

module.exports = { models, toolModelMapping };
