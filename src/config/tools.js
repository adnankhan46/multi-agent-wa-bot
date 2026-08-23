const tools = {
  SUMMARIZE: {
    name: "summarize_text",
    description: "Summarize quoted messages or text content",
    handler: "handleSummarize"
  },
  WEB_SEARCH: {
    name: "web_search",
    description: "Search the internet for current information",
    handler: "handleWebSearch"
  },
  NORMAL_CHAT: {
    name: "normal_chat",
    description: "Regular conversation and general questions",
    handler: "handleNormalChat"
  }
};

module.exports = tools;