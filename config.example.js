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
    },
    emojis: {
        "success":"<:success:778685739877007420>",
        "failed":"<:failed:778685739876483092>",
        "loading":"<a:loading:778685739709628417>",
        "sync":"<:sync:778686528821657600>"
    }
};