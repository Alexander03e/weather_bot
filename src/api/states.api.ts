import { RedisClientType, createClient } from "redis";

export type StatesType = {
  appStates: string;
  currentMsg: string;
  lvl: string;
  token: string;
  city: string;
};

const initialState: StatesType = {
  appStates: "test",
  currentMsg: "testmsg",
  token: "",
  city: "",
  lvl: "0",
};

export class StatesApi {
  private stateManager!: RedisClientType;
  private static instance: StatesApi | null = null;

  constructor() {
    this.launchStateManager();
  }

  public static getInstance() {
    if (this.instance) {
      return this.instance;
    }
    this.instance = new StatesApi();
    return this.instance;
  }

  async initStates(id: number) {
    await this.stateManager.set(id.toString(), JSON.stringify(initialState));
  }

  async launchStateManager() {
    this.stateManager = createClient();
    this.stateManager.on("error", (err) =>
      console.log("ERROR: redis client", err)
    );
    this.stateManager.connect();
  }
  async getState(id: number) {
    const states = JSON.parse(await this.stateManager.get(id.toString()));
    if (!states) {
      await this.initStates(id);
      return initialState;
    }
    return states;
  }
  async setStates(key: number, payload: StatesType) {
    await this.stateManager.set(key.toString(), JSON.stringify(payload));
  }
  async setToken(key: number, payload: string) {
    const data = await this.getState(key);
    const updatedData = { ...data, token: payload };
    await this.setStates(key, updatedData);
  }
}
