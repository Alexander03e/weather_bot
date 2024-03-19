import { config } from "dotenv";
export class ConfigToken {
  private readonly token: string | undefined;
  constructor() {
    const { error, parsed } = config();
    if (error) {
      console.log("Token error");
    }
    if (parsed?.BOT_TOKEN != undefined) {
      this.token = parsed.BOT_TOKEN;
    }
  }
  get() {
    if (this.token) {
      return this.token;
    } else {
      return "";
    }
  }
}
