const { Client, Collection } = require("discord.js");
const fs = require("fs");

const { Player } = require("discord-player");

require("dotenv").config()

class Dancefloor extends Client {
  /**
   * @constructor
   * @param {options} options options
   */
  constructor(options) {
    super(options);
    this.commands = new Collection();
    this.aliases = new Collection();
    this.wait = require("util").promisify(setTimeout);
    this.logger = require("./modules/Logger");
    this.admin = process.env.OWNERS;
    this.db = require("quick.db");

  }

  /**
   * clean text
   * @param {String} text text
   */
  cleanText(text) {
    if (typeof text !== "string")
      text = require("util").inspect(text, { depth: 1 });

    text = text
      .replace(/`/g, "`" + String.fromCharCode(8203))
      .replace(/@/g, "@" + String.fromCharCode(8203))
      .replace(
        new RegExp(this.token, "g"),
        "TOK3N"
      );

    return text;
  }

  /**
   * getCommand
   * @param {String} name command name
   */
  getCommand(name) {
    return this.commands.get(name) || this.commands.get(this.aliases.get(name));
  }

  /**
   * awaitReply
   * @param {String} msg message
   * @param {string} question question
   * @param {Number} limit time limit
   */
  async awaitReply(msg, question, limit = 60000) {
    const filter = m => (m.author.id = msg.author.id);
    await msg.channel.send(question);
    try {
      const collected = await msg.channel.awaitMessages(filter, {
        max: 1,
        time: limit,
        errors: ["time"]
      });
      return collected.first().content;
    } catch (e) {
      return false;
    }
  }

  /**
   * parseNumber
   * @param {String} string string to parse
   */
  parseNumber(string) {
    const isNumber = string => isFinite(string) && +string === string;
    const isString = string => typeof string === "string";
    function parseNumberFromString(str) {
      const matches = str
        .replace(/,/g, "")
        .match(/(\+|-)?((\d+(\.\d+)?)|(\.\d+))/);
      return matches && matches[0] ? Number(matches[0]) : NaN;
    }
    if (isNumber(string)) {
      return Number(string);
    }
    if (isString(string)) {
      return parseNumberFromString(string);
    }
    return NaN;
  }

  /**
   * resolveCase
   * @param {String} channel channel id
   */
  async resolveCase(channel) {
    return await require("./modules/Case")(this, this.channels.get(channel));
  }
}

const client = new Dancefloor({ disableEveryone: true });
const player = new Player(client);

client.player = player;



async function init() {
  // commands
  fs.readdir("./commands/", (err, files) => {
    if (err) return console.error(err);
    files.forEach(dir => {
      fs.readdir(`./commands/${dir}/`, (err, cmd) => {
        cmd.forEach(file => {
          if (!file.endsWith(".js")) return;
          let Props = require(`./commands/${dir}/${file}`);
          let commandName = file.split(".")[0];
          client.logger.log(`Loading Command: ${commandName}...`, "log");
          let props = new Props(client);
          props.help.category = dir;
          props.location = `./commands/${dir}/${file}`;
          client.commands.set(props.help.name, props);
          props.help.aliases.forEach(alias => {
            client.aliases.set(alias, props.help.name);
          });
        });
      });
    });
  });

  // events
  fs.readdir("./events/", (err, files) => {
    client.logger.log(`Loading a total of ${files.length} events.`, "log");
    files.forEach(file => {
      const eventName = file.split(".")[0];
      client.logger.log(`Loading Event: ${eventName}`);
      const event = new (require(`./events/${file}`))(client);
      client.on(eventName, (...args) => event.run(...args));
      delete require.cache[require.resolve(`./events/${file}`)];
    });
  });

  client.login(process.env.TOKEN);
}

init();

client
  .on("disconnect", () => client.logger.warn("websocket is disconnected..."))
  .on("reconnecting", () =>
    client.logger.log("websocket is reconnecting, please wait...", "log")
  )
  .on("error", e => client.logger.error(e))
  .on("warn", info => client.logger.warn(info));

module.exports = client;

String.prototype.toProperCase = function() {
  return this.replace(/([^\W_]+[^\s-]*) */g, function(txt) {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  });
};


process.on("uncaughtException", err => {
  console.error("Uncaught Exception: ", err);
  process.exit(1);
});

process.on("unhandledRejection", err => {
  console.error("Uncaught Promise Error: ", err);
});
