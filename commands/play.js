const Discord = require("discord.js");
const embed = new Discord.RichEmbed();
const embedCheck = require("../functions/embedPerms.js");
const config = require("../config.js");
const playNext = require("../functions/playNext.js");
const ytapi = require("simple-youtube-api");
const { parse } = require("url");
const youtube = new ytapi(config.youtubeAPIKey);


exports.run = async (client, message, args, level) => {
  const song = args.join(" ");
  if (!song.length) return message.reply("You need to supply a YouTube URL or a search term.");

  const voiceChannel = message.member.voiceChannel ? message.member.voiceChannel : (message.guild.voiceConnection ? message.guild.voiceConnection.channel : null);
  if (!voiceChannel || (!message.member.voiceChannel && level < 2)) {
    return message.reply("Please be in a voice channel first!");
  }

  if (!client.playlists.has(message.guild.id)) {
    var firstSong = true;
    client.playlists.set(message.guild.id, {
      dispatcher: null,
      queue: [],
      connection: null,
      position: -1
    });
    await voiceChannel.join();
  }

  let id = (() => {
    const parsed = parse(song, true);
    if (/^(www\.)?youtube\.com/.test(parsed.hostname)) {
      return parsed.query.v;
    } else if (/^(www\.)?youtu\.be/.test(parsed.hostname)) {
      return parsed.pathname.slice(1);
    }
  })();

  if (!id) {
    const results = await youtube.searchVideos(song, 4);
    id = results[0].id;
  }

  let info;
  try {
    info = await youtube.getVideoByID(id);
  } catch (e) {
    return message.channel.send(`\`An error occurred: ${e}\``);
  }

  if (message.author.permLevel < 2 && parseInt(info.durationSeconds) > 900) return message.reply("Songs can be no longer than 15 minutes.").catch(console.error);
  const time = parseInt(info.durationSeconds, 10);
  const minutes = Math.floor(time / 60);

  let seconds = time % 60;

  if (seconds < 10) seconds = "0" + seconds;
  client.playlists.get(message.guild.id).queue.push({
    url: `https://www.youtube.com/watch?v=${info.id}`,
    id: info.id,
    channName: info.channel.title,
    songTitle: info.title,
    playTime: `${minutes}:${seconds}`,
    playTimeSeconds: info.durationSeconds,
    requester: message.guild.member(message.author).displayName,
    requesterIcon: message.author.avatarURL
  });

  if (firstSong) {
    playNext(message);
  } else {
    embed
      .setTitle(`**${info.title}** (${minutes}:${seconds}) has been added to the queue`)
      .setColor(0xDD2825)
      .setFooter(`Requested by ${message.guild.member(message.author).displayName}`, message.author.avatarURL)
      .setImage(`https://i.ytimg.com/vi/${info.id}/mqdefault.jpg`)
      .setTimestamp()
      .setURL(`https://www.youtube.com/watch?v=${info.id}`);
    if (embedCheck(message)) {
      message.channel.send({embed}).catch(console.error);
    } else {
      message.channel.send(`**${info.title}** (${minutes}:${seconds}) has been added to the queue`);
    }
  }
};

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: [],
  permLevel: "User"
};

exports.help = {
  name: "play",
  category: "Music",
  description: "Play a song from YouTube.",
  usage: "play [YouTube Video URL] or [Search Term]"
};
