const Dancefloor = require("./Base/Dancefloor");
const dotenv = require('dotenv');
const logger = require('./Base/Logger');
const { ShardingManager } = require('kurasuta');
const { join } = require('path');
const { GatewayIntentBits } = require("discord.js");

dotenv.config();

const sharder = new ShardingManager(join(__dirname, 'Base/main.js'), {
	client: Dancefloor,
    token: process.env.TOKEN,
    respawn: true,
    development: process.env.NODE_ENV === 'development',
    ipcSocket: 9999,
    clientOptions: {
        intents: [
            GatewayIntentBits.GuildVoiceStates,
            GatewayIntentBits.Guilds,
            GatewayIntentBits.GuildMessages
        ],
        ws: {
            properties: {
                $browser: "Discord iOS"
            }
        }
    }
});

sharder.on('shardCreate', shard => logger.log(`Launched shard ${shard.id}`, 'ready'));
sharder.on('debug', message => logger.log(message, 'debug'));
sharder.on('warn', message => logger.log(message, 'warn'));
sharder.on('error', message => logger.log(message, 'error'));



sharder.spawn();