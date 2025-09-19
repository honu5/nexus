const TelegramBot = require("node-telegram-bot-api")

const environment = require("dotenv")
environment.config()

const token = process.env.TOKEN

const bot = new TelegramBot(token, {polling: true})


bot.onText(/\//)
//
