// import { Context } from "telegraf";
// import { Update } from "telegraf/typings/core/types/typegram";
// import { IController } from "../utils/types";

import { message } from "telegraf/filters";
import { Context, Markup } from "telegraf";
import { StatesApi } from "../../api/states.api";
import { Bot } from "../../app/bot";
import { keyboard } from "telegraf/typings/markup";
import { buttons, navButtons, backButton } from "../keyboard";
import axios from "axios";

// export class NavigationContoller implements IController {
//   private static instance: NavigationContoller | null = null;
//   onMessage: (ctx: Context<Update>, payload: string) => Promise<boolean>;
//   launch: () => Promise<void>;
// }

const getWeather = async (token: string, city: string) => {
  const { data } = await axios.get(
    `https://api.openweathermap.org/data/2.5/weather`,
    {
      params: {
        q: city,
        appid: token,
        lang: "ru",
        units: "metric",
      },
    }
  );
  console.log(data);
  return data;
};

export class NavigationController {
  private static instance: NavigationController | null = null;

  private statesApi = StatesApi.getInstance();

  private constructor(private readonly bot: Bot) {}

  public static getInstance(bot: Bot) {
    if (this.instance) return this.instance;
    this.instance = new NavigationController(bot);

    return this.instance;
  }

  private async navPagesActionHandler(ctx: Context, next: boolean) {
    const state = await this.statesApi.getState(ctx.from.id);
    console.log(state);
  }

  async lounchCommands() {
    this.bot.botInstance.start(async (ctx: Context) => {
      const data = await this.bot.getState(ctx.chat.id);
      this.bot.screenOpener(ctx);
      const keyboard = Markup.inlineKeyboard([
        [Markup.button.callback(buttons.weather, "weather")],
        [Markup.button.callback(buttons.random, "random")],
      ]);
      // const keyboard = Markup.keyboard([[buttons.weather], [buttons.random]]);
      await this.bot.sendNewMessage(ctx, `Добро пожаловать}`, keyboard);
    });
    this.bot.botInstance.command("state", async (ctx: Context) => {
      const data = await this.bot.getState(ctx.chat.id);
      const keyboard = Markup.inlineKeyboard([
        Markup.button.callback(
          navButtons.back.name,
          navButtons.back.callback_data
        ),
      ]);
      this.bot.sendNewMessage(
        ctx,
        `Текущий стейт \n${JSON.stringify(data)}`,
        keyboard
      );
    });
    // console.log(this.bot.botInstance);
  }

  async getBot() {
    console.log(this.bot.botInstance);
  }

  async lounchAction() {
    // this.bot.botInstance.on(message("text"), (ctx) => {
    //   try {
    //     ctx.reply("erer");
    //     if (ctx.text == "text") {
    //       console.log("text send");
    //     }
    //   } catch (e) {
    //     console.log("error");
    //   }
    // });
    this.bot.botInstance.action("weather", async (ctx) => {
      console.log("weather");
      const keyboard = Markup.inlineKeyboard([
        [Markup.button.callback("Назад", "back")],
        [Markup.button.callback("Погода", "getWeather")],
      ]);
      const { lvl } = await this.statesApi.getState(ctx.chat.id);
      // await this.statesApi.setStates()
      await this.bot.editLastMessage(
        ctx,
        `Прогноз погоды \nуровень: ${lvl}`,
        keyboard
      );
    });

    this.bot.botInstance.action("back", async (ctx: Context) => {
      console.log("back");
    });

    this.bot.botInstance.action("getWeather", async (ctx: Context) => {
      const data = await this.bot.getState(ctx.chat.id);
      // const token = process.env.BOT_TOKEN;
      if (data.token.length) {
        const weather = await getWeather(data.token, "moscow");
        console.log(weather);
        const keyboard = Markup.inlineKeyboard([
          Markup.button.callback(
            navButtons.back.name,
            navButtons.back.callback_data
          ),
        ]);
        this.bot.editLastMessage(
          ctx,
          `Температура: ${weather.main.temp} C (ощущается как ${weather.main.feels_like}) \nГород: ${weather.name}, ${weather.weather[0].description}`,
          keyboard
        );
      }
      if (!data.token.length) {
        this.bot.botInstance.on("message", async (ctx: Context) => {
          try {
            if (ctx.text) {
              const updatedData = {
                ...data,
                token: ctx.text,
              };
              await this.bot.setState(ctx.chat.id, updatedData);
              ctx.reply(`Ваш токен: ${ctx.text}`);
            }
          } catch (e) {
            console.log("Error token");
          }
        });
        ctx.reply("no token");
      }
      // if (!data.city.length) {
      //   // if (ctx.message.location)
      //   ctx.reply("Введите город");

      //   console.log(ctx);
      // }

      // console.log(data.token);
      // console.log(data.token);
    });

    this.bot.botInstance.command("help", async (ctx) => {
      try {
        ctx.reply(`${ctx.text} command`);
        console.log(ctx.text);
      } catch (e) {
        console.log("Error");
      }
    });

    this.bot.botInstance.action("next", (ctx) => {});
  }

  async lounch() {
    this.lounchAction();
    this.lounchCommands();
  }
}
