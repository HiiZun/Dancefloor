let musicManager = require("../Base/MusicManager")
let Dancefloor = require("../Base/Dancefloor");
const MusicManager = require("../Base/MusicManager");
const AutoPoster = require("../Base/BotListsPoster")
class Ready {
/**
 * 
 * @param {Dancefloor} client 
 */
    constructor(client) {
        this.client = client;
    }

    run() {

        this.client.musicManager = new MusicManager(this.client)

        new AutoPoster(this.client)

        this.client.logger.log(`Bot logged as ${this.client.user.tag}`, 'ready')

        this.client.user.setActivity({
            name: `${this.client.config.prefix}help • Playing on 0 servers • 0 Audio Nodes`,
            type: "LISTENING"
        })

        this.client.setInterval(() => {
            this.client.user.setActivity({
                name: `${this.client.config.prefix}help • Playing on ${this.client.musicManager.queue.size||0} servers • ${this.client.musicManager.startedNodes.length||0} Audio Nodes`,
                type: "LISTENING"
            })
        }, 2 * 60 * 1000)
        

    }

}

module.exports = Ready;