const Command = require("../../Base/Command");
const {MessageEmbed} = require("discord.js")

class Resume extends Command {

    constructor(client) {
        super(client, {
            name: "resume",
            aliases: [],
            description: "Resume the playing of the music"
        });
    }

    async run(message, args) {
        const serverQueue = this.client.musicManager.queue.get(message.guild.id);
        if (!serverQueue) return message.channel.send("Queue is empty!");
        if (serverQueue.playing) return message.channel.send("Queue is being played");
        serverQueue.resume();
        message.channel.send("Resumed !");
    }

}

module.exports = Resume;