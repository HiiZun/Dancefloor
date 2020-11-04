const { start } = require("repl");

module.exports = {
    name: "play",
    run: async (client, message, args) => {
        if (!message.member.voice.channel) return message.channel.send("You must join a voice channel to use this command.");

        let track = args.join(" ")
        
        let song = await client.musicManager.getSongs(track);
        switch (song.loadType) {
            case "SEARCH_RESULT":
                startPlaying(song.tracks[0])
                break;
            case "NO_MATCHES":
                error("there is no matching video")
                break;
            case "LOAD_FAILED":
                error("failed to load")
                break;
            case "PLAYLIST_LOADED":
                let selected = song.playlistInfo.selectedTrack;

                if (selected !== -1)
                  return [ song.tracks[selected] ];
      
                let playlist = song.tracks.slice(0, 200);
                startPlaying(playlist);
                break;
            case "TRACK_LOADED":
                startPlaying(song.tracks[0])
                break;
            default:
                error("unknown error code")
                break;
        }
function error(err) {
   return message.channel.send(`Oops an error occured while tried to search: ${err}`)
}

function startPlaying(songs) {
    client.musicManager.handleVideo(message, message.member.voice.channel, songs);

}
    }
};