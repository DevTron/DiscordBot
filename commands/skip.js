exports.run = (client, message, level) => {
    const voiceChannel = message.member.voiceChannel ? message.member.voiceChannel : (message.guild.voiceConnection ? message.guild.voiceConnection.channel : null);
    if (!voiceChannel || (!message.member.voiceChannel && level < 2)) {
      return message.reply("Please be in a voice channel first!");
    }
  
    const voiceUsers = Math.floor(message.member.voiceChannel.members.filter(m => m.user.id !== client.user.id).size * 2 / 3);
  
    if (voiceUsers < 2 || message.author.permLevel > 2) {
      return message.channel.send("Skipping song...").then(()=> {
        client.playlists.get(message.guild.id).dispatcher.end("skip");
      });
    }
  
    message.channel.send(`You have 10 seconds to vote for the \`skip\`, you need at least ${voiceUsers} votes to be successful`);
  
    const filter = m => m.content.startsWith("skip");
  
    message.channel.awaitMessages(filter, {
      "errors": ["time"],
      "max": voiceUsers,
      time: 10000
    }).then(collected => {
      if (collected.size > voiceUsers) return message.channel.send("Skipping song...").then(()=> {
        client.playlists.get(message.guild.id).dispatcher.end("skip");
      });
    }).catch(collected => {
      if(collected.size === 0) {
        return message.channel.send("No one voted, sorry!");
      }
      message.channel.send(`Only ${collected.size} out of ${voiceUsers} voted before the time ran out!`);
    });
  
  };
  
  exports.conf = {
    enabled: true,
    guildOnly: true,
    aliases: ["next"],
    permLevel: "Bot Owner"
  };
  
  exports.help = {
    name: "skip",
    category: "Music",
    description: "Skips the currently playing song.",
    usage: "skip"
  };
  