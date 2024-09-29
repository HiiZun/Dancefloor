const { BaseCluster } = require('kurasuta');
const logger = require('./Logger');

module.exports = class extends BaseCluster {
	launch() {
        logger.log(`Launched shard ${this.id}`, 'ready');		
	}
};