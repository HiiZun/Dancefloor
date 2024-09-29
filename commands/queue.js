const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('queue')
        .setDescription('List all the songs in the queue!'),
    async execute(interaction) {
        // list songs in the queue with their rank, titles, authors and durations and time left to play
        const player = interaction.client.riffy.players.get(interaction.guild.id);
        if (!player) return await interaction.reply('No music is playing in this server!');

        if (player.queue.size <= 1 || !player.current) return await interaction.reply('There are no songs in the queue!');
        
        const current = player.current;
        const queue = player.queue;

        let embed = new EmbedBuilder()
            .setTitle(`Queue ${queue.size > 0 ? `(${queue.size} songs)` : ''}`)
            .setDescription(`Now Playing: [${current.info.title} - ${current.info.author}](${current.info.uri})
                \`\`\`css
${queue.map((track, i) => { 
    let duration;
    if(!track.stream) {
        let minutes = Math.floor(track.info.length / 60000);
        let seconds = ((track.info.length % 60000) / 1000).toFixed(0);
        duration = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    }

    return `${i + 1}. ${track.info.title} - ${track.info.author} [${!track.stream ?  duration : 'LIVE ∞'}]`
}).join('\n').slice(0, 1950)}
\`\`\`
`)
            .setColor(0x00FF00)
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });
    },
};