const Command = require("../../Base/Command");

class Play extends Command {
  constructor(client) {
    super(client, {
      name: "play",
      description: "Play music in a voice channel from youtube.",
      aliases: ["player", "youtube"],
      usage: ["play <query/url>"],
      permissions: []
    });
  }

  async execute(message, args, Discord) {
   

    //If the member is not in a voice channel
    if(!message.member.voice.channel) return message.channel.send(`You're not in a voice channel, please join one !`);

    //If no music is provided
    if (!args[0]) return message.channel.send(`Please enter a query !`);

    const aTrackIsAlreadyPlaying = this.client.player.isPlaying(message.guild.id);

        // If there's already a track playing 
        if(aTrackIsAlreadyPlaying){

            // Add the track to the queue
            try {
            const result = await this.client.player.addToQueue(message.guild.id, args.join(" ")).catch(() => {});
            if(!result) return message.channel.send(`Oops i have found nothing for you query, please try again with more pertinent words`);

            if(result.type === 'playlist'){
                message.channel.send(`${result.tracks.length} songs added to the queue !`);
            } else {
                message.channel.send(`${result.name} added to the queue !`);
            }
        } catch(e) {
            console.log(e)
            return message.channel.send("Oops, it's seem i have got a error, the error is logged !")
        }
        } else {

            // Else, play the song
            try {
            const result = await this.client.player.play(message.member.voice.channel, args.join(" ")).catch(() => {});
            if(!result) return message.channel.send(`Oops i have found nothing for you query, please try again with more pertinent words`)

            if(result.type === 'playlist'){
                message.channel.send(`${result.tracks.length} songs added to the queue!\nCurrently playing ${result.tracks[0].name} !`);
            } else {
                message.channel.send(`Now playing \`${result.name}\` !`);
            }

            const queue = this.client.player.getQueue(message.guild.id)
            .on('end', () => {
                message.channel.send(`The queue just ended !`);
            })
            .on('trackChanged', (oldTrack, newTrack) => {
                message.channel.send(`Now playing \`${newTrack.name}\` !`);
            })
            .on('channelEmpty', () => {
                message.channel.send(`Stop playing because the channel is empty !`);
            });

        } catch(e) {
            return message.channel.send("Oops, it's seem i have got a error, the error is logged !")
        }
        }
    }



  }


module.exports = Play;
