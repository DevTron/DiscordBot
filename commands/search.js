const config = require("../config.js");
const ytapi = require("simple-youtube-api");
const youtube = new ytapi(config.youtubeAPIKey);

exports.run = async (client, message, args) => {
  const search = args.join(" ");
  try {
    const results = await youtube.searchVideos(search, 5);
    return message.channel.send(`Top 5 Results\n\n🎧 ${results.map(i => `${i.title}\n🔗 https://www.youtube.com/watch?v=${i.id}\n`).join("\n🎧 ")}`, {code:true});
  } catch (e) {
    message.reply(e.message);
  }

};

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: [],
  permLevel: "User"
};

exports.help = {
  name: "search",
  category: "Music",
  description: "Finds a song on YouTube",
  usage: "search [search term]"
};
