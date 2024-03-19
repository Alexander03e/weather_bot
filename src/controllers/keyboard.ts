import { Markup } from "telegraf";

export const buttons = {
  weather: "Узнать погоду",
  random: "Случайное число",
};

export const navButtons = {
  back: {
    name: "Назад",
    callback_data: "back",
  },
};

export const backButton = Markup.button;
