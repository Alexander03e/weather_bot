import { Context, Markup, Telegraf } from "telegraf";
import { StatesApi } from "../api/states.api";
import { NavigationController } from "../controllers/navigation/navigation.controller";
import { keyboard } from "telegraf/typings/markup";

export class Bot {
  // bot: Telegraf;
  public botInstance: Telegraf;

  private currentMsgId = -1;
  private currentMsgText = "";
  private chadId: number = 0;
  private readonly configControllers;
  private readonly statesApi = StatesApi.getInstance();

  constructor(token: string) {
    this.botInstance = new Telegraf(token);
    this.configControllers = {
      navigationController: NavigationController.getInstance(this),
    };
  }

  // private async sendNewMessage(
  //   ctx: Context,
  //   message: string,
  //   keyboard: Markup.Markup<any>
  // ) {
  //   const newMessage = await ctx.reply(message, keyboard);
  //   console.log(newMessage.message_id);
  //   console.log(newMessage.text);
  // }

  public async screenOpener(ctx: Context) {
    const data = await this.statesApi.getState(ctx.from.id);
    this.getState(ctx.from.id);
    console.log(data);
  }

  public async getState(id: number) {
    const data = await this.statesApi.getState(id);
    if (!data) {
      this.statesApi.launchStateManager();
    }
    console.log(await this.statesApi.getState(id));
    return await this.statesApi.getState(id);
  }

  public async setState(key, payload) {
    this.statesApi.setStates(key, payload);
  }

  async sendNewMessage(ctx: Context, message: string, keyboard?: any) {
    await ctx.sendMessage(message, keyboard);
  }
  async editLastMessage(
    ctx: Context,
    message: string,
    keyboard?: Markup.Markup<any>
  ) {
    try {
      keyboard
        ? await ctx.editMessageText(message, keyboard)
        : await ctx.editMessageText(message);
      // await this.botInstance.telegram.editMessageText(message, keyboard)
    } catch (e) {
      console.log("Edit error");
    }
  }

  async editMessage(ctx: Context, message) {
    // const editedMessage = await ctx.edi;
  }
  public async launch() {
    // const promises: Promise<void>[] = [];
    // [...Object.values(this.configControllers)].forEach((controller) => {
    //   promises.push(controller.lounch());
    // });
    // console.log()
    // await Promise.all(promises);
    await this.configControllers.navigationController.lounch();
    this.botInstance.launch();
  }
}
