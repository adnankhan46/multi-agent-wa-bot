const { extractTextFromPDF, findPDFInHistory } = require('./pdfHandlers.js');
const AIService = require('../utils/aiService.js');

const aiService = new AIService();

async function executeTool(handlerName, message, chat, chatId, userPrompt, client, getChatHistory) {
  console.log(`🔧 Executing ${handlerName} with optimized model...`);
  
  switch (handlerName) {    
    case 'handleSummarize':
      return await handleSummarize(message, chat, userPrompt, client, getChatHistory);
    
    case 'handleWebSearch':
      return await handleWebSearch(message, chat, chatId, userPrompt, client, getChatHistory);
    
    case 'handleNormalChat':
    default:
      return await handleNormalChat(message, chat, chatId, userPrompt, client, getChatHistory);
  }
}


/**
 *  Controller function for Tool calling
 */
async function handleSummarize(message, chat, userPrompt, client, getChatHistory) {
  console.log(`📝 Handling summarization: ${userPrompt}`);
  
  if (message.hasQuotedMsg) {
    const quotedMsg = await message.getQuotedMessage();
    const quotedText = quotedMsg.body.trim();
    
    // Use SUMMARIZER model (lightweight and fast)
    const aiResponse = await aiService.getAIResponse(
      `Summarize the following text concisely:\n\n${quotedText}`, 
      chat.id._serialized, 
      client, 
      getChatHistory, 
      'handleSummarize'
    );
    
    const myNumber = process.env.OWNER_NUMBER;
    const personalChat = await client.getChatById(`${myNumber}@c.us`);
    await personalChat.sendMessage(`🐋 *Summary:* ${aiResponse}`);
    
  } else {
    message.reply("🐋 Please reply to the message you want to summarize.");
  }
}

async function handleWebSearch(message, chat, chatId, userPrompt, client, getChatHistory) {
  console.log(`🐋 Handling WEB HISTORY chat: ${userPrompt}`);
  
  let genAIRequest = userPrompt;
  
  if (message.hasQuotedMsg) {
    const quotedMsg = await message.getQuotedMessage();
    const repliedMessage = quotedMsg.body.trim();
    genAIRequest = `${userPrompt}, ${repliedMessage}`;
  }
  
  try {
    const aiResponse = await aiService.getAIResponse(
      genAIRequest, 
      chatId, 
      client, 
      getChatHistory, 
      'handleWebSearch'
    );
    
    if (chat.isGroup) {
      chat.sendMessage(`🐋 *BooleanAI:* ${aiResponse}`);
    } else {
      message.reply(`🐋 *BooleanAI:* ${aiResponse}`);
    }
    
  } catch (error) {
    console.error('X | Error in Web Search chat:', error);
    message.reply('X | Sorry, I had trouble responding to that, ws');
  }
}

async function handleNormalChat(message, chat, chatId, userPrompt, client, getChatHistory) {
  console.log(`🐋 Handling normal chat: ${userPrompt}`);
  
  let genAIRequest = userPrompt;
  
  if (message.hasQuotedMsg) {
    const quotedMsg = await message.getQuotedMessage();
    const repliedMessage = quotedMsg.body.trim();
    genAIRequest = `${userPrompt}, ${repliedMessage}`;
  }
  
  try {
    const aiResponse = await aiService.getAIResponse(
      genAIRequest, 
      chatId, 
      client, 
      getChatHistory, 
      'handleNormalChat'
    );
    
    if (chat.isGroup) {
      chat.sendMessage(`🐋 *BooleanAI:* ${aiResponse}`);
    } else {
      message.reply(`🐋 *BooleanAI:* ${aiResponse}`);
    }
    
  } catch (error) {
    console.error('X | Error in normal chat:', error);
    message.reply('X |Sorry, I had trouble responding to that.');
  }
}

module.exports = {
  executeTool
};
