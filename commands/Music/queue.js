const Command = require("../../Base/Command");

class Queue extends Command {
  constructor(client) {
    super(client, {
      name: "queue",
      description: "get the waiting queue.",
      aliases: ["list", "q"],
      usage: ["queue"],
      permissions: []
    });
  }

  async execute(message, args, Discord) {
 if(!message.member.voice.channel) return message.channel.send(`You're not in a voice channel !`);

 //Get queue
 const queue = this.client.player.getQueue(message.guild.id);

 //If there's no music
 if(!queue) return message.channel.send(`I'm not playing any music, please make me playing something with before !`);

 //Message
 message.channel.send(`**Server queue**\nCurrent - ${queue.playing.name} | ${queue.playing.author}\n`+
 (
     queue.tracks.map((track, i) => {
         return `#${i+1} - ${track.name} | ${track.author}`
     }).join('\n')
 ), { split:true });
  }
}

module.exports = Queue;
