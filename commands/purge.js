exports.run = (client, message, args) => {
    if (!message.guild.me.hasPermission("MANAGE_MESSAGES"))
       return message.reply("I don't have permission to purge");
    const messagecount = parseInt(args.join(' '));
    message.channel.fetchMessages({
      limit: messagecount + 1
    }).then(messages => message.channel.bulkDelete(messages).catch(error => message.channel.send("Error: ${error}")));
  };
  
  exports.conf = {
    enabled: true,
    guildOnly: false,
    aliases: [],
    permLevel: "Administrator"
  };
  
  exports.help = {
    name: 'purge',
    category: "Management",
    description: 'Purges X amount of messages from a given channel.',
    usage: 'purge <number>'
  };