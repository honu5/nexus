const TelegramBot = require("node-telegram-bot-api");

const environment = require("dotenv");
environment.config();

const token = process.env.TOKEN;

const bot = new TelegramBot(token, { polling: true });

bot.onText(/\/emoji/, async (msg) => {
  const chatId = msg.chat.id;
  try {
    const response = await fetch("https://emojihub.yurace.pro/api/random");
    console.log("Response", response);
    const emoji = await response.json();
    console.log("Emoji body", emoji);
    // bot.sendMessage(chatId, "Hello! \u{1F917}");

    const message = emoji.unicode[0].substring(2, 8);
    const parser = String.fromCodePoint(parseInt(message, 16));

    console.log(`message`, message);
    bot.sendMessage(chatId, `Here is random emoji from Nexus ${parser}`);
  } catch (error) {
    bot.sendMessage(chatId, "Couldn't send random emoji");
    console.log("Error", error);
  }
});

// messages.
bot.on("message", (msg) => {
  const chatId = msg.chat.id;

  // send a message to the chat acknowledging receipt of their message
  bot.sendMessage(chatId, "Received your message");
});
console.log(`The bot is running`);

//
