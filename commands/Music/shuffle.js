const Command = require("../../Base/Command");
const {MessageEmbed} = require("discord.js")

class Shuffle extends Command {

    constructor(client) {
        super(client, {
            name: "shuffle",
            aliases: [],
            description: "Shuffle the queue"
        });
    }

    async run(message, args) {
        const serverQueue = this.client.musicManager.queue.get(message.guild.id);
        if(!serverQueue) return message.channel.send("Queue is empty!");
        serverQueue.songs = this.shuffle(serverQueue.songs)
        return message.channel.send(`Queue shuffled !`)
    
};

    shuffle(a) {
        for (let i = a.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [a[i], a[j]] = [a[j], a[i]];
        }
        return a;
    }

}

module.exports = Shuffle;