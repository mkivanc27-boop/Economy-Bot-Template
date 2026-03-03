const { Client, GatewayIntentBits } = require("discord.js");
const fs = require("fs");

console.log("BOT STARTED");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

let data = {};
const dataFile = "./data.json";

if (fs.existsSync(dataFile)) {
  data = JSON.parse(fs.readFileSync(dataFile));
}

function save() {
  fs.writeFileSync(dataFile, JSON.stringify(data, null, 2));
}

function loadModules() {
  const modules = fs.readdirSync("./modules");
  for (const file of modules) {
    require(`./modules/${file}`)(client, data, save);
  }
}

loadModules();

client.once("ready", () => {
  console.log("LOGGED IN AS", client.user.tag);
});

// 🔥 TOKEN BURADA ENV'DEN GELİYOR
client.login(process.env.TOKEN);
