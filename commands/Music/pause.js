const Command = require("../../Base/Command");

class Pause extends Command {
  constructor(client) {
    super(client, {
      name: "pause",
      description: "Pause the current playing music.",
      aliases: [],
      usage: ["pause"],
      permissions: []
    });
  }

  async execute(message, args, Discord) {
    if(!message.member.voice.channel) return message.channel.send(`You're not in a voice channel !`);

    //If there's no music
    if(!this.client.player.isPlaying(message.guild.id)) return message.channel.send(`No music playing on this server !`);

    const track = await this.client.player.pause(message.guild.id);

    //Message
    message.channel.send(`Song ${track.name} paused !`);
  }
}

module.exports = Pause;
