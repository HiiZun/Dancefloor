const Command = require("../../Base/Command");
const {MessageEmbed} = require("discord.js")

class Volume extends Command {

    constructor(client) {
        super(client, {
            name: "volume",
            aliases: ["vol"],
            description: "Change or see the current volume"
        });
    }

    async run(message, args) {
        const serverQueue = this.client.musicManager.queue.get(message.guild.id);
        if (!serverQueue) return message.channel.send("Queue is empty!");
        if (!args[0]) {
            message.channel.send(`Current volume: **${serverQueue.volume}%**.`);
        } else {
            const value = args[0];
            if (isNaN(value)) return message.channel.send("Make sure the value is a number.");
            if(parseInt(value) > 250) return message.channel.send("Volume limit reached (250%)")
            if(parseInt(value) < 0) return message.channel.send("Invalid value (less than 0%)")
            serverQueue.setVolume(parseInt(value));
            message.channel.send(`New volume: **${value}%**.`);
        }
    }

}

module.exports = Volume;