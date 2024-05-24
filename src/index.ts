import { Client, Events, GatewayIntentBits, Partials } from "discord.js";
import dotenv from "dotenv";
dotenv.config();

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
