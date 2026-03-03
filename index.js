require("http").createServer((req,res)=>{res.end("OK")}).listen(process.env.PORT || 3000);
const { Client, GatewayIntentBits } = require("discord.js");
const fs = require("fs");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

const TOKEN = require("./config.json").token;

let data = {};
const dataFile = "./data.json";

if (fs.existsSync(dataFile)) {
  data = JSON.parse(fs.readFileSync(dataFile));
}

function save() {
  fs.writeFileSync(dataFile, JSON.stringify(data, null, 2));
}

client.modules = {};

const modules = fs.readdirSync("./modules");

for (let file of modules) {
  const module = require(`./modules/${file}`);
  module(client, data, save);
}

client.login(TOKEN);
