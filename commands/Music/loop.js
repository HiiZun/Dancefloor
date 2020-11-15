const Command = require("../../Base/Command");
const {MessageEmbed} = require("discord.js")

class Loop extends Command {

    constructor(client) {
        super(client, {
            name: "loop",
            aliases: ["repeat"],
            description: "Repeat the current playing music"
        });
    }

    async run(message, args) {
        const serverQueue = this.client.musicManager.queue.get(message.guild.id);
        if (!serverQueue) return message.channel.send("Queue is empty!");
        serverQueue.loop = !serverQueue.loop;
        message.channel.send(`Loop has been ${serverQueue.loop ? "enabled" : "disabled"}`);
    }

}

module.exports = Loop;