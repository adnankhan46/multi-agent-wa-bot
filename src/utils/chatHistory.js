async function getChatHistory(client, chatId) {
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
        senderLabel = contact.shortName ?? senderId;
        console.log("Naam ", contact.name, "Real NAAM ag= ", contact.shortName);
      }
    }
    formatted.push(`${senderLabel}: ${msg.body}`);
  }

  return formatted.join('\n');
}

module.exports = {
  getChatHistory
};
