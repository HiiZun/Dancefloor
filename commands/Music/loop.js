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
    if(!message.member.voice.channel) return message.channel.send(`You're not in a voice channel !`);

    //If there's no music
    if(!client.player.isPlaying(message.guild.id)) return message.channel.send(`No music playing on this server !`);

    //Repeat mode
    const repeatMode = client.player.getQueue(message.guild.id).repeatMode;

    //If the mode is enabled
    if(repeatMode) {

        client.player.setRepeatMode(message.guild.id, false);

        //Message
        return message.channel.send(`Repeat mode disabled !`);

    //If the mode is disabled
    } else {

        client.player.setRepeatMode(message.guild.id, true);

        //Message
        return message.channel.send(`Repeat mode enabled !`);

    }
  }
}

module.exports = Loop;
