const { Client } = require("discord.js");
/**
 * 
 * @param {Client} client 
 * @param {Array} startedNodes array of started nodes
 * @returns {String} node id
 */
module.exports.select = (client, startedNodes) => {
    if(!client instanceof Client) throw TypeError("client must be a valid instance of Client !")
    /**
     * Find the node with the less of players
     */
    startedNodes.forEach(node => node.stats.players)

    let node = startedNodes.find(node => node.stats.players === Math.min.apply(null, startedNodes.map(n => node.stats.players)));
    /**
     * If don't find randomly select one lol
     */
    if(!node){
        node = startedNodes[Math.floor(Math.random() * startedNodes.length)];
    }
    return node;

}