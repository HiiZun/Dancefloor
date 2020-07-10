const Command = require("../../Base/Command");

class Np extends Command {
  constructor(client) {
    super(client, {
      name: "np",
      description: "fetch the now playing music's name.",
      aliases: ["nowplaying", "now-playing", "now"],
      usage: ["np"],
      permissions: []
    });
  }

  async execute(message, args, Discord) {
    if(!message.member.voice.channel) return message.channel.send(`${this.client.msgemojis.no} | You're not in a voice channel !`);

    if(!this.client.player.isPlaying(message.guild.id)) return message.channel.send(`${this.client.msgemojis.no} | There is no music playing on this server !`);

    const song = await this.client.player.nowPlaying(message.guild.id);

    //Message
    message.channel.send(`Currently playing \`${song.name}\`\nProgression : [${this.client.player.createProgressBar(message.guild.id)}]`);

  }
}

module.exports = Np;
