const Command = require("../../Base/Command");
const {MessageEmbed} = require("discord.js")
class Vote extends Command {

    constructor(client) {
        super(client, {
            name: "vote",
            aliases: ["votes"],
            description: "Help the bot by voting for !!!"
        });
    }

    async run(message, args) {

        if(this.client.config.botlists.votes.length == 0) return message.channel.send("Votes are disabled on this bot") 


        let embed = new MessageEmbed()
        .setColor("BLUE")
        .setDescription("Vote for Dancefloor to thank us for our work.")

        this.client.config.botlists.votes.forEach(bl => {
            embed.addField(`${bl.emoji||""} ${bl.name}`, `[**\`[Vote]\`**](${bl.url.vote}) - [[Bot profile]](${bl.url.bot}) - [[Website]](${bl.url.home})`)
        })

        return message.channel.send(embed)
    
    }

}

module.exports = Vote;