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

        let nodes = await this.client.db.nodes.findAll()

        if(nodes.length < 1) {
            return logger.log('No nodes found in the database, please add one', 'error');
        }

        this.client.riffy.init(this.client.user.id);

    }

}

module.exports = ClientReady;