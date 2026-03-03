const { EmbedBuilder } = require("discord.js");

module.exports = (client, data, save) => {

  function getUser(id) {
    if (!data[id]) {
      data[id] = {
        money: 1000,
        inventory: [],
        luck: 1,
        pets: []
      };
    }
    return data[id];
  }

  client.on("messageCreate", (message) => {
    if (message.author.bot) return;

    const user = getUser(message.author.id);

    // MONEY
    if (message.content === "!money") {
      message.reply(`💰 Paran: ${user.money} coin`);
    }

    // DAILY
    if (message.content === "!daily") {
      const reward = Math.floor(Math.random() * 1000) + 500;
      user.money += reward;
      save();
      message.reply(`🎁 Günlük ödül: ${reward} coin`);
    }
  });

};
