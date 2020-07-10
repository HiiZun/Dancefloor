const Command = require("../../Base/Command");

class Volume extends Command {
  constructor(client) {
    super(client, {
      name: "resume",
      description: "Resume music after a pause.",
      aliases: [],
      usage: ["resume"],
      permissions: []
    });
  }

  async execute(message, args, Discord) {

    
    if(!message.member.voice.channel) return message.channel.send(`${this.client.msgemojis.no} | You're not in a voice channel !`);

    if(!this.client.player.isPlaying(message.guild.id)) return message.channel.send(`${this.client.emojis.no} | There is no music playing on this server !`);

    if(!args[0]) return message.channel.send(`${this.client.msgemojis.no} | Please enter a number bethween 0 and 100 !`);

    if(isNaN(args[0])) return message.channel.send(`${this.client.msgemojis.no} | Please enter a valid number bethween 0 and 100 !`);
    if(100 < args[0])  return message.channel.send(`${this.client.msgemojis.no} | Please enter a valid number bethween 0 and 100 !`)
    if(args[0] <=0) return message.channel.send(`${this.client.msgemojis.no} | Please enter a valid number bethween 0 and 100 !`)

    if(message.content.includes("-") || message.content.includes("+") || message.content.includes(",") || message.content.includes(".")) return message.channel.send(`${this.client.msgemojis.no} | Please enter a valid number bethween 0 and 100 !`)

    this.client.player.setVolume(message.guild.id, parseInt(args.join(" ")));

    message.channel.send(`${this.client.msgemojis.yes} | Volume set to \`${args.join(" ")}%\` !`);

  }
}

module.exports = Volume;
