import { Context } from "telegraf";

export interface IController {
  launch: () => Promise<void>;
  onMessage: (ctx: Context, payload: string) => Promise<boolean>;
}
