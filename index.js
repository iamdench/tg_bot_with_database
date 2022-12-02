const TelegramApi = require('node-telegram-bot-api');
const {gameOptions, againOptions} = require('./options');
const token = require('./secret');

const bot = new TelegramApi(token, {polling: true});

bot.setMyCommands([{
    command: '/start', description: 'Старт',
}, {
    command: '/info', description: 'Кто я?',
}, {
    command: '/game', description: 'Игра "Угадай цифру"',
}
])

const chat = {};

const startGame = async (chatId) => {
    await bot.sendMessage(chatId, `Сейчас я загадаю тебе цифру от 0 до 5, а ты отгадай`);
    const randomNumber = Math.floor(Math.random() * 6);
    chat[chatId] = randomNumber;
    await bot.sendMessage(chatId, `Загадал, отгадывай`, gameOptions);
    return;
}

bot.on('message', async (msg) => {
    const text = msg.text;
    const chatId = msg.chat.id;
    console.log(msg);

    if (text === '/start') {
        await bot.sendSticker(chatId, 'https://tlgrm.ru/_/stickers/eb7/80f/eb780f5f-99e7-4005-8c35-898b61b096cd/11.webp');
       await bot.sendMessage(chatId, `Привет, пока я умею только повторять то, что ты написал мне`);
       return;
    }

    if (text === '/info') {
        await bot.sendMessage(chatId, `Привет, тебя зовут ${msg.from.first_name} ${msg.from.last_name}`);
        return;
    }

    if (text === '/game') {
        return startGame(chatId);
    }

    await bot.sendMessage(chatId, `Ты написал мне "${text}"`);
})

bot.on('callback_query', async msg => {
    const data = msg.data;
    const chatId = msg.message.chat.id;
    if (data === '/play_again') {
        return startGame(chatId);
    }

    if (+data === +chat[chatId]) {
        await bot.sendSticker(chatId, 'https://tlgrm.ru/_/stickers/ccd/a8d/ccda8d5d-d492-4393-8bb7-e33f77c24907/1.webp');
        return await bot.sendMessage(chatId, `Поздравляю! Ты угадал, это была цифра ${chat[chatId]}`, againOptions);
    } else {
        await bot.sendSticker(chatId, 'https://tlgrm.ru/_/stickers/ccd/a8d/ccda8d5d-d492-4393-8bb7-e33f77c24907/10.webp');
        return await bot.sendMessage(chatId, `Увы, в этот раз мимо, это была цифра ${chat[chatId]}`, againOptions);
    }
})
