const { Sequelize } = require('sequelize');
const logger = require('./Logger');

require('dotenv').config();

let sequelize;

if(process.env.NODE_ENV === 'development') {

    sequelize = new Sequelize({
        dialect: 'sqlite',
        storage: './database.sqlite',
        logging: (msg) => logger.log(msg, 'debug')
    });

} else {

    sequelize = new Sequelize({
        dialect: 'mariadb',
        host: process.env.DB_HOST,
        port: process.env.DB_PORT || "3306",
        username: process.env.DB_USER,
        password: process.env.DB_PASS,
        database: process.env.DB_NAME,
        logging: (msg) => logger.log(msg, 'debug')
    });

}

sequelize.alwaysplay = sequelize.define('alwaysplay', {
    guild_id: {
        type: Sequelize.STRING,
        allowNull: false
    },
    channel_id: {
        type: Sequelize.STRING,
        allowNull: false
    },
    song: {
        type: Sequelize.STRING,
        allowNull: false
    }
});

sequelize.nodes = sequelize.define('nodes', {
    name: {
        type: Sequelize.STRING,
        allowNull: false
    },
    host: {
        type: Sequelize.STRING,
        allowNull: false
    },
    port: {
        type: Sequelize.STRING,
        allowNull: false
    },
    password: {
        type: Sequelize.STRING,
        allowNull: false
    },
    secure: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true
    }
});

try {
    sequelize.authenticate().then(() => {
    logger.log('Connection has been established successfully.', 'debug');


    sequelize.sync().then(() => {
        logger.log('All models were synchronized successfully.', 'log');
    })

})

  } catch (error) {
    logger.log('Unable to connect to the database:' + error, 'error');
    throw new Error('Unable to connect to the DB');
  }

module.exports = sequelize;