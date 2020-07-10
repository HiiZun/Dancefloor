const Command = require("../../Base/Command");

class Loop extends Command {
  constructor(client) {
    super(client, {
      name: "loop",
      description: "Loop the current playing song.",
      aliases: ["repeatmode"],
      usage: ["loop"],
      permissions: []
    });
  }

  async execute(message, args, Discord) {
    if(!message.member.voice.channel) return message.channel.send(`${this.client.msgemojis.no} | You're not in a voice channel !`);

    //If there's no music
    if(!this.client.player.isPlaying(message.guild.id)) return message.channel.send(`${this.client.msgemojis.no} | No music playing on this server !`);

    //Repeat mode
    const repeatMode = this.client.player.getQueue(message.guild.id).repeatMode;

    if(repeatMode) {

      this.client.player.setRepeatMode(message.guild.id, false);

        return message.channel.send(`${this.client.msgemojis.yes} | Repeat mode disabled !`);

    } else {

      this.client.player.setRepeatMode(message.guild.id, true);

        return message.channel.send(`${this.client.msgemojis.yess} | Repeat mode enabled !`);

    }
  }
}

module.exports = Loop;
