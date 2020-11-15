const Command = require("../../Base/Command");
const {MessageEmbed} = require("discord.js");
const ms = require("ms")

class Queue extends Command {

    constructor(client) {
        super(client, {
            name: "queue",
            aliases: ["q"],
            description: "Get the current queue"
        });
    }

    async run(message, args) {
        const serverQueue = this.client.musicManager.queue.get(message.guild.id);
        if (!serverQueue) return message.channel.send("Queue is empty!");
        let index = 0;

        message.channel.send(`
**Current Queue**

${serverQueue.songs.map(songs => `**${++index}.** ${songs.info.title}`).splice(0, 10).join("\n")}
${serverQueue.songs.length <= 10 ? "" : `And ${serverQueue.songs.length - 10} more..`}

**Theoretical duration: ${ms(serverQueue.songs.map(s => s.info.length).reduce((a, b) => a + b), { long: true})||"Unfetchable"}**
`);
    }

}

module.exports = Queue;