const Command = require("../../Base/Command");
const {MessageEmbed} = require("discord.js")

class Stop extends Command {

    constructor(client) {
        super(client, {
            name: "stop",
            aliases: ["dc", "disconnect", "end", "leave"],
            description: "Skip the currently played music"
        });
    }

    async run(message, args) {
        const serverQueue = this.client.musicManager.queue.get(message.guild.id);
        if (!serverQueue) return message.channel.send(`${this.client.config.emojis.failed} | Queue is empty !`);
        serverQueue.destroy();
        message.channel.send(`${this.client.config.emojis.success} | Disconnected !`);
    }

}

module.exports = Stop;