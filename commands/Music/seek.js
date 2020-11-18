const Command = require("../../Base/Command");
const {MessageEmbed} = require("discord.js")

class Seek extends Command {

    constructor(client) {
        super(client, {
            name: "seek",
            aliases: ["move"],
            description: "Set the time marker of the video."
        });
        this.durationPattern = /^[0-5]?[0-9](:[0-5][0-9]){1,2}$/;
    }

    async run(message, args) {
        const serverQueue = this.client.musicManager.queue.get(message.guild.id);
        if (!serverQueue) return message.channel.send(`${this.client.config.emojis.failed} | Queue is empty!`);
        if (!args[0]) return message.channel.send(`${this.client.config.emojis.failed} | Please provide a number which is the duration (e.g. : 1:55) where will be the marker`)

        let duration = args[0]

        if (!serverQueue.songs[0].info.isSeekable)
        return message.channel.send(`${this.client.config.emojis.failed} | Current track isn't seekable.`);

   
    if (!this.durationPattern.test(duration))
        return message.channel.send(`${this.client.config.emojis.failed} | You provided an invalid duration (e.g.: 1:25)`);

    const durationMs = this.durationToMillis(duration);
    if (durationMs > serverQueue.songs[0].info.length)
        return message.channel.send(`${this.client.config.emojis.failed} | The duration that you provided exceeds the duration of the current track.`);

    try {
        await serverQueue.player.seek(durationMs);
        message.channel.send(`${this.client.config.emojis.success} | Seeked to ${duration}.`);
    } catch (e) {
        message.channel.send(`${this.client.config.emojis.failed} | An error occured: ${e.message}.`);
    }

        }

        durationToMillis(dur) {
            return dur.split(":").map(Number).reduce((acc, curr) => curr + acc * 60) * 1000;
        }


}

module.exports = Seek;