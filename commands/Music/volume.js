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

    
    if(!message.member.voice.channel) return message.channel.send(`You're not in a voice channel !`);

    //If there's no music
    if(!client.player.isPlaying(message.guild.id)) return message.channel.send(`No music playing on this server !`);

    //Args
    if(!args[0]) return message.channel.send(`Please enter a number bethween 0 and 100 !`);

    //Security modification
    if(isNaN(args[0])) return message.channel.send(`Please enter a valid number bethween 0 and 100 !`);
    if(100 < args[0])  return message.channel.send(`Please enter a valid number bethween 0 and 100 !`)
    if(args[0] <=0) return message.channel.send(`Please enter a valid number bethween 0 and 100 !`)

    //Cannot put (-), (+), (,) or (.)
    if(message.content.includes("-")) return message.channel.send(`Please enter a valid number bethween 0 and 100 !`)
    if(message.content.includes("+")) return message.channel.send(`Please enter a valid number bethween 0 and 100 !`)
    if(message.content.includes(",")) return message.channel.send(`Please enter a valid number bethween 0 and 100 !`)
    if(message.content.includes(".")) return message.channel.send(`Please enter a valid number bethween 0 and 100 !`)

    //Set volume
    client.player.setVolume(message.guild.id, parseInt(args.join(" ")));

    //Message
    message.channel.send(`Volume set to \`${args.join(" ")}%\` !`);

  }
}

module.exports = Volume;
