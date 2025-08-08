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
// const { systemPrompt } = require('./prompt.js');
const newSystemPrompt = require("./newPrompt.js")
const path = require('path');
const client = require("./auth/clientAuth.js")

dotenv.config();

// const client = new Client(); v1
// v2

async function getChatHistory(chatId) {
  const chat = await client.getChatById(chatId);
  const messages = await chat.fetchMessages({ limit: 60 });
  const My_mePushName = client.info.pushname; 
  console.log("MY NAME", My_mePushName);
  const formatted = [];

  for (const msg of messages) {
    let senderLabel;

    if (msg.fromMe) {
      senderLabel = `You (${My_mePushName})`;
    } else {
      const senderId = msg.author || msg.from;
      const contact = await client.getContactById(senderId);

      if (contact.isMe) {
        senderLabel = `You (${My_mePushName})`;
      } else {
        senderLabel =
          contact.shortName ??
          senderId;
          console.log("Naam ",contact.name, "Real NAAM ag= ", contact.shortName)
      }
    }
    formatted.push(`${senderLabel}: ${msg.body}`);
  }

  return formatted.join('\n');
}


// client.on('qr', (qr) => { v1
//   qrcode.generate(qr, { small: true });
// });

// let botId;
// client.on('ready', async () => {
//    botId = client.info.wid._serialized;
//   console.log("ID1: ", botId)

//   console.log('✅ WhatsApp client is ready!');

  // Filter groups
//   const groups = chats.filter(chat => chat.isGroup);

//   console.log(`🤖 The bot is currently participating in ${groups.length} groups:`);

//   groups.forEach(group => {
//     console.log(`- ${group.name} (ID: ${group.id._serialized})`);
//   });
// }); v1
// v2
// QR code only shows FIRST TIME or when session expires
client.on('qr', (qr) => {
  console.log('🔐 Scan QR Code to authenticate:');
  qrcode.generate(qr, { small: true });
  console.log('⚠️  QR expires in 20 seconds');
});

client.on('authenticated', (session) => {
  console.log('✅ Authentication successful!');
  console.log('📱 Session saved - no QR needed next time');
});

client.on('auth_failure', (msg) => {
  console.error('❌ Authentication failed:', msg);
  // Delete corrupted session and restart
  client.destroy();
  setTimeout(() => client.initialize(), 5000);
});

let botId;
client.on('ready', async () => {
  botId = client.info.wid._serialized;
  console.log("ID1: ", botId)
  console.log('🚀 Bot is ready and authenticated!');
});

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('🛑 Shutting down gracefully...');
  await client.destroy();
  process.exit(0);
});

// Main

client.on('message_create', async (message) => {
  let genAIRequest = "";
  const chat = await message.getChat();
  const chatId = chat.id._serialized;

  //  console.log("All Chats: ",chat);

  console.log("Current chat id: ", chatId);

  const chatHistory = await getChatHistory(chatId);
  // console.log(`Chat History of [ ${chatId} ]: `, chatHistory);

   const isFromBot = message.from === botId;
   console.log("ID2: ", message.from)

  // Process messages that mention @boolean or start with /ask
  if (message.body.includes('@boolean') || message.body.startsWith('/ask')) {
    const userPrompt = message.body
      .replace('@boolean', '')
      .replace('@Boolean', '')
      .replace('/ask', '')
      .trim();
genAIRequest=userPrompt;
    const isQuotedMsg = message.hasQuotedMsg;
    if(isQuotedMsg){
      const quotedMsg = await message.getQuotedMessage();

      const repliedMessage = quotedMsg.body.replace('@boolean', '').replace('@Boolean', '').replace('/ask', '').trim();
      const finalReplyWithMessage = userPrompt + ", " + repliedMessage;
genAIRequest=finalReplyWithMessage;
    }
console.log("////// Final wala genAiReq:  ", genAIRequest, "  /////////////////")
    
console.log("Only msg.body ", message.body)
    console.log(`### 1111111111111 ####### ${chat.isGroup ? '[Group]' : '[Private]'} message from ${isFromBot ? '{bot}' : '{user}'}: `, genAIRequest);

    const aiResponse = await getAIResponse(genAIRequest, chatId);
    console.log("RES: ", aiResponse)

    if (chat.isGroup) {
      chat.sendMessage(`🐋 *BooleanAI:* ${aiResponse}`);
    } else {
      message.reply(`🐋 *BooleanAI:* ${aiResponse}`);
    }
  }

  // send to my personal
  if (message.body.startsWith('/summarize')) {
  const isQuotedMsg = message.hasQuotedMsg;
  if (isQuotedMsg) {
    const quotedMsg = await message.getQuotedMessage();
    const quotedText = quotedMsg.body.trim();

    console.log("Text to summarize:", quotedText);

    // Send the summarization prompt to the AI
    const aiResponse = await getAIResponse(`Summarize the following text:\n\n${quotedText}`, chatId);

    // Now, send the summary **only to your personal chat**
    const myNumber = process.env.OWNER_NUMBER;  // Store your number in .env
    const personalChat = await client.getChatById(`${myNumber}@c.us`);
    await personalChat.sendMessage(`📄 *Summary:* ${aiResponse}`);
  } else {
    message.reply("Please reply to the message you want to summarize.");
  }
}

  // exit command
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