"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_telegram_bot_api_1 = __importDefault(require("node-telegram-bot-api"));
const configs_1 = require("./configs/configs");
const bot = new node_telegram_bot_api_1.default(configs_1.configs.BOT_TOKEN, { polling: true });
const chats = {};
const gameOptions = {
    reply_markup: JSON.stringify({
        inline_keyboard: [
            [{ text: '1', callback_data: '1' }, { text: '2', callback_data: '2' }, { text: '3', callback_data: '3' }],
            [{ text: '4', callback_data: '4' }, { text: '5', callback_data: '5' }, { text: '6', callback_data: '6' }],
            [{ text: '7', callback_data: '7' }, { text: '8', callback_data: '8' }, { text: '9', callback_data: '9' }],
            [{ text: '0', callback_data: '0' }]
        ]
    })
};
const againOptions = {
    reply_markup: JSON.stringify({
        inline_keyboard: [
            [{ text: 'Play again', callback_data: '/again' }]
        ]
    })
};
const startGame = async (chatId) => {
    await bot.sendMessage(chatId, "I choose number");
    const bot_number = Math.floor(Math.random() * 10);
    chats[chatId] = bot_number;
    await bot.sendMessage(chatId, "Guess", gameOptions);
};
const start = () => {
    bot.setMyCommands([
        { command: '/start', description: "welcome hi" },
        { command: '/info', description: "Info" },
        { command: '/game', description: "Play a guess game" },
    ]);
    bot.on("message", async (msg) => {
        const { text, chat, from } = msg;
        if (text === '/start') {
            await bot.sendSticker(chat.id, 'https://tlgrm.eu/_/stickers/8a1/9aa/8a19aab4-98c0-37cb-a3d4-491cb94d7e12/256/93.webp');
            return bot.sendMessage(chat.id, `Hey there, i'm ready to help`);
        }
        if (text === '/info') {
            return bot.sendMessage(chat.id, `You are ${from.first_name} ${from.last_name}`);
        }
        if (text === "/game") {
            startGame(chat.id);
        }
        return bot.sendMessage(chat.id, "Can't understand You");
    });
    bot.on("callback_query", async (msg) => {
        const data = msg.data;
        const chatId = msg.message.chat.id;
        if (data === '/again') {
            startGame(chatId);
        }
        if (data == chats[chatId]) {
            return await bot.sendMessage(chatId, `You win, i guess number ${chats[chatId]}`, againOptions);
        }
        else {
            return await bot.sendMessage(chatId, `You are wrong, i guess number ${chats[chatId]}`, againOptions);
        }
    });
};
start();
