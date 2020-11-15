const { Client } = require("discord.js");
const MusicManager = require("./MusicManager");

/**
 * @class MusicClient
 * @extends {Client}
 */
class Dancefloor extends Client {
    /**
     * @param {import("discord.js").ClientOptions} [opt]
     */
    constructor(opt) {
        super(opt);
        this.config = require("../../config.json");
        this.musicManager = null;

        this.login(this.config.token);

        this
        .on("ready", () => {
            this.musicManager = new MusicManager(this);
            console.log("Bot is online!");
            this.user.setActivity({
                name: `2 Brothers on the 4th floor • Playing on ${this.musicManager.queue.size||0} servers • ${this.musicManager.startedNodes.length||0} Audio Nodes`,
                type: "LISTENING"
            })

            this.setInterval(() => {
                this.user.setActivity({
                    name: `2 Brothers on the 4th floor • Playing on ${this.musicManager.queue.size||0} servers • ${this.musicManager.startedNodes.length||0} Audio Nodes`,
                    type: "LISTENING"
                })
            }, 1 * 60 * 1000)
            
        })
        .on("message", async message => {
            if (message.author.bot || !message.guild) return;
            if (!message.content.startsWith(this.config.prefix)) return;
            const args = message.content.slice(this.config.prefix.length).trim().split(/ +/g);
            const command = args.shift().toLowerCase();

            try {
                const cmd = require(`../commands/${command}`);
                if (!cmd) return;
                await cmd.run(this, message, args);
            } catch (e) {
                if (e.message.startsWith("Cannot find module")) return;
                console.error(e.stack);
            }
        });
    }
}

module.exports = Dancefloor;