module.exports = {
    token: "TOKEN",
    prefix: "!",
    owners: ["OWNER1", "OWNER2"],
    nodes: [
        { "id": "Host1", "host": "my.lavalink.be", "port": 2333, "password": "youshallnotpass" }
    ],
    botlists: {
        "enabled": false,
        "interval": 30,
        "botlists":{
            /* see https://github.com/botblock/BLAPI/blob/master/src/fallbackListData.ts */
        },
        "danbot":false
    }
};