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

    // SLOT
    if (message.content.startsWith("!slot")) {

      const bet = 100;
      if (user.money < bet)
        return message.reply("❌ Yetersiz bakiye!");

      const symbols = ["🍒", "⭐", "💎"];
      const result = [
        symbols[Math.floor(Math.random() * symbols.length)],
        symbols[Math.floor(Math.random() * symbols.length)],
        symbols[Math.floor(Math.random() * symbols.length)]
      ];

      let win = false;

      if (result[0] === result[1] && result[1] === result[2]) {
        win = true;
        user.money += 1000;
      } else {
        user.money -= bet;
      }

      save();

      message.reply(`🎰 ${result.join(" | ")}\n${win ? "🔥 Kazandın!" : "💸 Kaybettin!"}`);
    }

    // COINFLIP
    if (message.content.startsWith("!coinflip")) {

      const bet = parseInt(message.content.split(" ")[1]);
      if (!bet || user.money < bet)
        return message.reply("❌ Geçersiz bahis!");

      const win = Math.random() > 0.5;

      if (win) {
        user.money += bet;
        message.reply(`🪙 Kazandın! +${bet}`);
      } else {
        user.money -= bet;
        message.reply(`💀 Kaybettin! -${bet}`);
      }

      save();
    }

  });

};
