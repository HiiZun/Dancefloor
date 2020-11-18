const Command = require("../../Base/Command");
const {MessageEmbed} = require("discord.js")

class Pause extends Command {

    constructor(client) {
        super(client, {
            name: "pause",
            aliases: [],
            description: "Pause the current playing music"
        });
    }

    async run(message, args) {
        const serverQueue = this.client.musicManager.queue.get(message.guild.id);
        if (!serverQueue) return message.channel.send(`${this.client.config.emojis.failed} | Queue is empty!`);
        if (!serverQueue.playing) return message.channel.send(`${this.client.config.emojis.failed} | Queue already paused`);
        serverQueue.pause();
        message.channel.send(`${this.client.config.emojis.success} | Paused !`);
    }

}

module.exports = Pause;