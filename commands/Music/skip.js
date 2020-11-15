const Command = require("../../Base/Command");
const {MessageEmbed} = require("discord.js")

class Skip extends Command {

    constructor(client) {
        super(client, {
            name: "skip",
            aliases: [],
            description: "Skip the currently played music"
        });
    }

    async run(message, args) {
        const serverQueue = this.client.musicManager.queue.get(message.guild.id);
        if (!serverQueue) return message.channel.send("Queue is empty!");
        if(serverQueue.loop) return message.channel.send("Loop is enabled!")
        if (!serverQueue.playing) serverQueue.playing = true;
        serverQueue.skip();
        message.channel.send("Skipped !");
    }

}

module.exports = Skip;