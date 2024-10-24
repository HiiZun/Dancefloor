const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('nodes')
        .setDescription('[OWNER] Add/List/Remove Nodes to the bot')
        .addSubcommand(subcommand =>
            subcommand.setName('add')
            .setDescription('Add a Node')
            .addStringOption(option => option.setName('name').setDescription('Name of the Node').setRequired(true))
            .addStringOption(option => option.setName('host').setDescription('Host of the Node').setRequired(true))
            .addStringOption(option => option.setName('port').setDescription('Port of the Node').setRequired(true))
            .addStringOption(option => option.setName('password').setDescription('Password of the Node').setRequired(true))
            .addBooleanOption(option => option.setName('secure').setDescription('Is the Node secure').setRequired(false))
        )
        .addSubcommand(subcommand =>
            subcommand.setName('list')
            .setDescription('List all Nodes')
        )
        .addSubcommand(subcommand =>
            subcommand.setName('remove')
            .setDescription('Remove a Node')
            .addStringOption(option => option.setName('name').setDescription('Name of the Node').setRequired(true))
        ),
    async execute(interaction) {

        // check if the user is the owner
        let owners = process.env.OWNERS ? process.env.OWNERS.split(',') : [];
        if (!owners.includes(interaction.user.id)) return await interaction.reply('You are not the owner of the bot!');

        // get the subcommand
        const subcommand = interaction.options.getSubcommand();

        switch (subcommand) {
            case "list":
                // get all the nodes
                let nodes = await interaction.client.db.nodes.findAll();

                // create the embed
                let embed = new EmbedBuilder()
                    .setTitle('Nodes')
                    .setDescription('List of all the nodes connected to the bot')
                    .addFields(...nodes.map(node => {
                        let riffymap = interaction.client.riffy.nodeMap.get(node.name);
                        console.log(riffymap.stats);
                        return {
                        name: `${node.name} - ${riffymap?.connected ? "ON" : "OFF"}`,
                        value: `
                        ${riffymap.connected ? `
**CPU**: ${riffymap.stats?.cpu?.cores ? `${riffymap.stats.cpu.cores} Cores CPU | Load: ${riffymap.stats.cpu.systemLoad}` : 'N/A'}
**Memory**: ${riffymap.stats?.memory?.free ? `${Math.floor(riffymap.stats.memory.free/1024/1024)}/${Math.floor((riffymap.stats.memory.free+riffymap.stats.memory.used)/1024/1024)} MB` : 'N/A'}
**Uptime**: ${riffymap?.stats?.uptime ? `Last restart: <t:${Math.floor((Date.now() - riffymap.stats.uptime)/1000)}:R>` : 'N/A'}
**Players**: ${riffymap.stats?.players ? riffymap.stats.players : 'N/A'} | **Playing**: ${riffymap.stats?.playingPlayers ? riffymap.stats.playingPlayers : 'N/A'}
` : "OFFLINE"}
`,
                        inline: true
                        }
                    }));
                    

                    await interaction.reply({ embeds: [embed] });
                break;

            case "add":

            // get the options
            const name = interaction.options.getString('name');
            const host = interaction.options.getString('host');
            const port = interaction.options.getString('port');
            const password = interaction.options.getString('password');
            let secure = interaction.options.getBoolean('secure');
            if(secure == null) secure = true;

            // check if the node already exists
            let node = await interaction.client.db.nodes.findOne({
                where: {
                    name: name
                }
            });
            if (node) return await interaction.reply('This node already exists!');

        // add the node to the database
        await interaction.client.db.nodes.create({
            name: name,
            host: host,
            port: port,
            password: password
        });

        await interaction.reply(`Node **${name}** has been added!`);
                break;

            case "remove":
                // get the options
                const nodename = interaction.options.getString('name');

                // check if the node exists
                let nodeget = await interaction.client.db.nodes.findOne({
                    where: {
                        name: nodename
                    }
                });
                if (!nodeget) return await interaction.reply('This node does not exist!');

                // check if the node is connected
                let riffymap = interaction.client.riffy.nodeMap.get(nodename);
                if (riffymap.connected) return await interaction.reply('This node is currently connected!');

                // remove the node
                await interaction.client.db.nodes.destroy({
                    where: {
                        name: nodename
                    }
                });

                await interaction.reply(`Node **${nodename}** has been removed!`);
                break;
        
            default:
                break;
        }

    },
};