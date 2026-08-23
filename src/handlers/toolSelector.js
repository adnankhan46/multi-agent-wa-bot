const AIService = require('../utils/aiService.js');

const aiService = new AIService();

async function selectBestTool(userMessage, hasMedia, hasQuoted, mediaType) {
  return await aiService.selectTool(userMessage, hasMedia, hasQuoted, mediaType);
}

module.exports = { selectBestTool };
