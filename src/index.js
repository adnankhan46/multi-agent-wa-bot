// import qrcode from 'qrcode-terminal';
// import { Client, LocalAuth} from 'whatsapp-web.js';
// import axios from 'axios';
// import dotenv from 'dotenv';
// import { systemPrompt } from './prompt.js';
// import { newSystemPrompt } from './newPrompt.js';
// import path from "path";
const qrcode = require('qrcode-terminal');
const axios = require('axios');
const dotenv = require('dotenv');
const newSystemPrompt = require("./config/newPrompt.js")
const path = require('path');
const client = require("./auth/clientAuth.js")
dotenv.config();

const { getChatHistory } = require('./utils/chatHistory.js');
const { selectBestTool } = require('./handlers/toolSelector.js');
const { executeTool, getAIResponseWithHistory } = require('./handlers/toolHandlers.js');



/**
 * Post AUTH Process
 */

// QR code only shows FIRST TIME or when session expires
client.on('qr', (qr) => {
  console.log(' Scan QR Code to authenticate:');
  qrcode.generate(qr, { small: true });
  console.log(' !QR expires in 20 seconds');
});

client.on('authenticated', (session) => {
  console.log(':) Authentication successful!');
  console.log('->| Session saved - no QR needed next time');
});

client.on('auth_failure', (msg) => {
  console.error('x) Authentication failed:', msg);
  // Delete corrupted session and restart
  client.destroy();
  setTimeout(() => client.initialize(), 5000);
});

let botId;
client.on('ready', async () => {
  botId = client.info.wid._serialized;
  console.log("ID1: ", botId)
  console.log('## Bot is ready and authenticated!');
});

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('XXX | Shutting down gracefully...');
  await client.destroy();
  process.exit(0);
});


// Main

client.on('message_create', async (message) => {
  const chat = await message.getChat();
  const chatId = chat.id._serialized;
  // const isFromBot = message.from === botId;

  console.log("Current chat id: ", chatId);

  // ### TOOL CALLING SYSTEM: Only process @boolean tagged messages
  if (message.body.includes('@boolean') || message.body.startsWith('/ask')) {
    console.log("🔧 Processing @boolean request with tool calling...");

    const userPrompt = message.body
      .replace('@boolean', '')
      .replace('@Boolean', '')
      .replace('/ask', '')
      .trim();
// show typing
    chat.sendStateTyping()
    // Gather context information
    const hasMedia = message.hasMedia;
    const hasQuoted = message.hasQuotedMsg;
    let mediaType = null;
    
    if (hasMedia) {
      const media = await message.downloadMedia();
      mediaType = media.mimetype;
    }

    // Select the best tool using AI
    const selectedTool = await selectBestTool(userPrompt, hasMedia, hasQuoted, mediaType);
    
    console.log(`[TOOL] | Selected tool: ${selectedTool.name}`);
    console.log(`[TOOL] | Handler: ${selectedTool.handler}`);

    try {
      await executeTool(selectedTool.handler, message, chat, chatId, userPrompt, client, getChatHistory);
      await chat.clearState();
    } catch (error) {
      console.error(`x| Error executing tool ${selectedTool.name}:`, error);
      message.reply('x| Sorry, I encountered an error processing your request.');
      await chat.clearState();
    }
  }

  // **LEGACY: Direct /summarize command**
  if (message.body.startsWith('/summarize')) {
    const isQuotedMsg = message.hasQuotedMsg;
    if (isQuotedMsg) {
      const quotedMsg = await message.getQuotedMessage();
      const quotedText = quotedMsg.body.trim();

      console.log("Text to summarize:", quotedText);

      const aiResponse = await getAIResponseWithHistory(`Summarize the following text:\n\n${quotedText}`, chatId, client, getChatHistory);

      const myNumber = process.env.OWNER_NUMBER;
      const personalChat = await client.getChatById(`${myNumber}@c.us`);
      await personalChat.sendMessage(`📄 *Summary:* ${aiResponse}`);
    } else {
      message.reply("Please reply to the message you want to summarize.");
    }
  }

  // Exit command
  if (message.body.includes('exit @boolean')) {
    client.destroy();
  }
});

async function getAIResponse(prompt, chatId) {
  const chatHistory = await getChatHistory(chatId);
  const fullPromptWithHistory = `
  ${newSystemPrompt}
  ------------------------------------------------
  Here is the recent chat history:
${chatHistory}
  `
  try {
    const response = await axios.post(
      'https://api.groq.com/openai/v1/chat/completions',
      {
        model: 'openai/gpt-oss-120b', // or any other model you want, llama3-70b-8192
        messages: [
          { role: 'system', content: fullPromptWithHistory },
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

    return response.data.choices[0].message.content.trim();
  } catch (error) {
    console.error('❌ Error calling Groq API:', error.response?.data || error.message);
    return 'Sorry, I had trouble fetching a response from the AI.';
  }
}

client.initialize();