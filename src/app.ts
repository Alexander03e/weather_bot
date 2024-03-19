import { createClient } from "redis";
import { Bot } from "./app/bot";
import { ConfigToken } from "./config/token.service";

const token = new ConfigToken();
const bot = new Bot(token.get());

// bot.botInstance.on("message", (ctx) => {
//   const chatId = ctx.chat.id;

//   // bot.getState(chatId);
//   // bot.sendNewMessage(ctx, "клавиатура");
// });

bot.launch();
