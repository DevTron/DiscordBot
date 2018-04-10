exports.run = (client, message) => {
    const voiceChannel = message.member.voiceChannel ? message.member.voiceChannel : (message.guild.voiceConnection ? message.guild.voiceConnection.channel : null);
    if (!voiceChannel || (!message.member.voiceChannel && message.author.permLevel < 2)) {
      return message.reply("Please be in a voice channel first!");
    }
    if (client.playlists.get(message.guild.id).dispatcher.paused) return message.reply("Playback is already paused.");
    message.channel.send("Pausing playback");
    client.playlists.get(message.guild.id).dispatcher.pause();
  };
  
  exports.conf = {
    enabled: true,
    guildOnly: true,
    aliases: ["p"],
    permLevel: "Server Owner"
  };
  
  exports.help = {
    name: "pause",
    category: "Music",
    description: "Pauses the audio stream.",
    usage: "Pause"
  };
  
