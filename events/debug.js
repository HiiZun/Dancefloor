module.exports = class {
    constructor(client) {
        this.client = client;
    }

    async run(debug) {
   if(process.env.DEBUG === "true") return this.client.logger.log(`Debug event was sent by Discord.js: \n${debug}`, "debug");
    }
};