const Discord = require("discord.js");
const embedCheck = require("../functions/embedPerms.js");
exports.run = (client, message, args, level) => { // eslint-disable-line no-unused-vars
  if (!client.playlists.has(message.guild.id)) return message.channel.send("The queue is empty.");

  let playlist = client.playlists.get(message.guild.id);
  playlist = playlist.queue.slice(playlist.position);

  const current = playlist.shift();
  const singular = playlist.length === 1;
  const embed = new Discord.RichEmbed();

  embed.setTitle(`Currently playing **${current.songTitle.substring(0, 50)}** (${current.playTime})`)
    .setColor(0xDD2825)
    .setFooter(`Requested by ${current.requester}`, current.requesterIcon)
    .setDescription(`There ${singular ? "is" : "are"} currently ${playlist.length} song${singular ? "" : "s"} in the queue.\n`)
    .setThumbnail(`https://i.ytimg.com/vi/${current.id}/mqdefault.jpg`)
    .setTimestamp()
    .setURL(current.url);

  if (embedCheck(message)) {
    for (let i = 0; i < playlist.length && i < 5; i++) {
      embed.addField(`🎧 ${playlist[i].songTitle.substring(0, 50)} (${playlist[i].playTime})`, `🤘 Requested by **${playlist[i].requester}**`);
    }
    message.channel.send({embed});
  } else {
    message.channel.send(`Currently playing **${current.songTitle.substring(0, 50)}** (${current.playTime})\n\nThere ${singular ? "is" : "are"} currently ${playlist.length} song${singular ? "" : "s"} in the queue.\n${playlist.map.size === 0 ? "" : "🎧" + playlist.map(i => "_" + i.songTitle+"_ (" + i.playTime + ") requested by **" + i.requester + "**\n🔗 <https://www.youtube.com/watch?v="+i.id+">\n").join("\n🎧 ")}`);
  }
};

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: ["playlist"],
  permLevel: "Server Owner"
};

exports.help = {
  name: "queue",
  category: "Music",
  description: "Displays how many songs are queued up after the currently playing song.",
  usage: "queue"
};
