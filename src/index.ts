import {
  Client,
  Events,
  GatewayIntentBits,
  SlashCommandBuilder,
  Partials,
  REST,
  Routes,
  Collection,
} from "discord.js";
import type { SlashCommand } from "./types";
import { join } from "path";
import { readdirSync } from "fs";
import dotenv from "dotenv";
dotenv.config();
import testCommand from "./slashCommands/ping";

const token = process.env.DISCORD_TOKEN; // Token from Railway Env Variable.
const client_id = process.env.CLIENT_ID;
const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.MessageContent],
  partials: [Partials.Channel],
});
client.once(Events.ClientReady, async (c) => {
  console.log(`Logged in as ${c.user.tag}`);
});

client
  .login(token)
  .catch((error) => console.error("Discord.Client.Login.Error", error));
