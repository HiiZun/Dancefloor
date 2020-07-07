const Command = require("../../Base/Command");

class Shuffle extends Command {
  constructor(client) {
    super(client, {
      name: "shuffle",
      description: "Shuffle the queue.",
      aliases: ["shuf"],
      usage: ["shuffle"],
      permissions: []
    });
  }

  async execute(message, args, Discord) {
    //If the member isn't in a voice channel
    if(!message.member.voice.channel) return message.channel.send(`You're not in a voice channel !`);

    //If there's no music
    if(!this.client.player.isPlaying(message.guild.id)) return message.channel.send(`No music playing on this server !`);


    this.client.player.shuffle(message.guild.id);

    //Message
    return message.channel.send(`Queue shuffled !`);
  }
}

module.exports = Shuffle;
