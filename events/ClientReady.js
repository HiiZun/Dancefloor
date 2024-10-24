const { ActivityType } = require("discord.js");
const Dancefloor = require("../Base/Dancefloor");
const logger = require('../Base/Logger');
class ClientReady {
/**
 * 
 * @param {Dancefloor} client 
 */
    constructor(client) {
        this.client = client;
    }

   async run() {

        logger.log(`Logged in as ${this.client.user.tag}`, "ready");
        this.client.user.setActivity({
            name: "Anything you want",
            type: ActivityType.Listening
        })

        this.client.riffy.init(this.client.user.id);

    }

}

module.exports = ClientReady;