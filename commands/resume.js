exports.run = (client, message) => {
    const voiceChannel = message.member.voiceChannel ? message.member.voiceChannel : (message.guild.voiceConnection ? message.guild.voiceConnection.channel : null);
    if (!voiceChannel || (!message.member.voiceChannel && message.author.permLevel < 2)) {
      return message.reply("Please be in a voice channel first!");
    }
    if (!client.playlists.get(message.guild.id).dispatcher.paused) return message.reply("Playback has not been paused.");
    message.channel.send("Resuming playback");
    client.playlists.get(message.guild.id).dispatcher.resume();
  };
  
  exports.conf = {
    enabled: true,
    guildOnly: true,
    aliases: [],
    permLevel: "User"
  };
  
  exports.help = {
    name: "resume",
    category: "Music",
    description: "Resumes the audio stream.",
    usage: "Resume"
  };
  
