const { Client } = require("discord.js");
const { start } = require("repl");
/**
 * 
 * @param {Client} client 
 * @param {Array} startedNodes array of started nodes
 * @returns {String} node id
 */
module.exports.select = (client, startedNodes) => {
    if(!client instanceof Client) throw TypeError("client must be a valid instance of Client !")
    let nodearrayid = startedNodes[Math.floor(Math.random() * startedNodes.length)];
    let nodeselected = nodearrayid.id

    return nodeselected;

}