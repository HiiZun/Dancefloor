const { handle } = require('blapi');
const Dancefloor = require('./Dancefloor');
const { Client: DBH } = require('danbot-hosting');

class BLPoster {
    /**
     * @param {Dancefloor} client 
     */
    constructor(client) {
        if(client.config.botlists.enabled){
            handle(client,  client.config.botlists.botlists, client.config.botlists.interval)
            client.logger.log(`Posted to BOTBLOCk.ORG`, 'debug')
        }
        if(client.config.botlists.danbot){
            let DBHAPI = new DBH(client.config.botlists.danbot, client)
            DBHAPI.autopost();
            client.logger.log(`Posted to DanBot Host`, 'debug')
        }

    }






}
module.exports = BLPoster;