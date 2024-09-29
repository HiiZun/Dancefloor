const { ActivityType } = require("discord.js");
const Dancefloor = require("../Base/Dancefloor");
const logger = require('../Base/Logger');

class InteractionCreate {
/**
 * 
 * @param {Dancefloor} client 
 */
    constructor(client) {
        this.client = client;
    }

    async run(interaction) {
        //interaction.deferReply();
        // receiving an interaction. classifying it depending if its a button, select menu, etc.
        interaction.receiveDate = Date.now();
        if(interaction.isCommand()) {

           // interaction.deferReply();
            const command = await this.client.commands.find(cmd => cmd.name === interaction.commandName);
            const commandFile = require(`../commands/${command.name}.js`);
            if(!command || !commandFile) return;
            try {
                interaction.client.riffy = this.client.riffy || {};
                await commandFile.execute(interaction);
            } catch (error) {
                logger.log(`Error while executing command ${command.name}: ${error}`, "error");
                interaction.reply({ content: "There was an error while executing this command!", ephemeral: true }).catch(() => {
                    interaction.editReply({ content: "There was an error while executing this command!", ephemeral: true }).catch(() => {
                        interaction.followUp({ content: "There was an error while executing this command!", ephemeral: true }).catch(() => {
                        });
                    });
                });
            }
        }


    }

}

module.exports = InteractionCreate;