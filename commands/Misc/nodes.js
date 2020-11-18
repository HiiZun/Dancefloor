const Command = require("../../Base/Command");
const {MessageEmbed} = require("discord.js")
const ms = require("ms")
class Nodes extends Command {

    constructor(client) {
        super(client, {
            name: "nodes",
            aliases: ["node"],
            description: "Show informations about audio nodes"
        });
    }

    async run(message, args) {
        message.channel.send(`${this.client.config.emojis.loading} | Fetching nodes status please wait...`).then((msg) => {

            let embed = new MessageEmbed()
            .setDescription("List of available audio nodes")
            this.client.musicManager.startedNodes.forEach(node => {
                embed.addField(`🟢 - ${node.id}`,`
ID: **${node.id}**
Playing streams: **${node.stats.playingPlayers}**
Uptime: **${ms(node.stats.uptime, { long: true })}**
`)
            });

msg.edit("", {
    embed: embed,
    content: null
})
        })
    }

}

module.exports = Nodes;