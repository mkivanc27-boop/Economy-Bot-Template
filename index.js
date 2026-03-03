const { Client: cln, Partials, IntentsBitField, Collection } = require("discord.js");
const fs = require("fs");
const readline = require("readline").createInterface({ input: process.stdin });

/**
 * @typedef CommandData
 * @property {any} data
 * @property {String} module
 * @property {(client: Client, interaction: any) => Promise<void>} execute
 */

class Client extends cln {
    /**
     * @type {Collection<String, CommandData>}
     */
    commands = new Collection();

    config = require("./config.json");

    constructor(options) {
        super(options);

        // COMMANDS
        const commandPath = __dirname + "/commands";

        if (fs.existsSync(commandPath)) {
            for (let command of fs.readdirSync(commandPath)) {
                const cmd = require(`./commands/${command}`);

                if (this.config.modules[cmd.module]) {
                    this.commands.set(cmd.data.name, cmd);
                }
            }
        }

        // EVENTS
        const eventPath = __dirname + "/events";

        if (fs.existsSync(eventPath)) {
            for (let event of fs.readdirSync(eventPath)) {
                try {
                    this.on(
                        event.split(".")[0],
                        async (...args) =>
                            await require(`./events/${event}`)(this, ...args)
                    );
                } catch (e) {
                    console.error(e);
                }
            }
        }
    }
}

const client = new Client({
    intents: [
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.MessageContent
    ],
    partials: [Partials.Message]
});

// Console test sistemi
readline.on("line", async (line) => {
    try {
        let dat = eval(line);
        if (dat instanceof Promise) dat = await dat;
        console.log(dat);
    } catch (e) {
        console.log(e);
    }
});

client.login(client.config.token);

module.exports = Client;
