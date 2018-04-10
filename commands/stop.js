exports.run = (client, message) => {
    const voiceChannel = message.member.voiceChannel ? message.member.voiceChannel : (message.guild.voiceConnection ? message.guild.voiceConnection.channel : null);
    if (!voiceChannel || (!message.member.voiceChannel && message.author.permLevel < 2)) {
      return message.reply("Please be in a voice channel first!");
    }

    if(client.playlists.has(message.guild.id)) {
      const queue = client.playlists.get(message.guild.id);
      queue.queue = [];
      queue.dispatcher.end();
    }
  };

  exports.conf = {
    enabled: true,
    guildOnly: true,
    aliases: [],
    permLevel: "User"
  };

  exports.help = {
    name: "stop",
    category: "Music",
    description: "Ends the current playlist.",
    usage: "Stop"
  };
