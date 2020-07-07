module.exports = class {
    constructor(client) {
        this.client = client;
    }

    async run() {
        this.client.user.setActivity(`d!help | ${this.client.guilds.cache.size} Guilds | ${this.client.users.cache.size} Users`, {
            type: "WATCHING"
        });
        this.client.logger.log(`${this.client.user.tag}, ready to serve ${this.client.users.cache.size} users in ${this.client.guilds.cache.size} servers.`, "ready");
    }
}