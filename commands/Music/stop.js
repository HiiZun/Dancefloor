const Command = require("../../Base/Command");

class Stop extends Command {
  constructor(client) {
    super(client, {
      name: "stop",
      aliases: ["end", "disconnect", "dc", "leave"],
      usage: ["stop"],
      description: "Stop the current music, leave the channel and clear the queue.",
      permissions: []
    });
  }

  async execute(message, args, Discord) {
    if(!message.member.voice.channel) return message.channel.send(`You're not in a voice channel, please join one !`);

    if(!this.client.player.isPlaying(message.guild.id)) return message.channel.send(`I'm not playing any music !`);

    this.client.player.stop(message.guild.id);

    message.channel.send(`I have correctly stopped everything !`);
  }
}

module.exports = Stop;
