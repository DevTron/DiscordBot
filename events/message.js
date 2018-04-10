// The MESSAGE event runs anytime a message is received
// Note that due to the binding of client to every event, every event
// goes `client, other, args` when this function is run.
module.exports = (client, message) => {
  // It's good practice to ignore other bots. This also makes your bot ignore itself
  // and not get into a spam loop (we call that "botception").
  if (message.author.bot) return;

  // Grab the settings for this server from Enmap.
  // If there is no guild, get default conf (DMs)
  const settings = message.settings = client.getGuildSettings(message.guild);
  const level = client.permlevel(message);
  
  // Swear Detection
  const swears = require("../modules/swears.js");
  var words = message.content.toLowerCase().trim().match(/\w+|\s+|[^\s\w]+/g);
  for (x = 0; x < 554; x++) {
    if (settings.profanityFilter === "true") {
      if (words.includes(swears.list[x])) {
        let log = message.guild.channels.find("name", settings.modLogChannel);
        if (settings.profanityMessage.includes("{{user}}")) {
          const curseMessage = settings.profanityMessage.replace("{{user}}", message.author.username);
            if (settings.profanityAlert === "true") {
              message.channel.send(curseMessage);
            }
            if (!log) {
              client.logger.warn(`[Profanity] ${client.config.permLevels.find(l => l.level === level).name} ${message.author.username} (${message.author.id}) detected cursing.`);
              message.delete();
              return;
            } else {
              message.guild.channels.find('name', settings.modLogChannel).send(`**[Profanity]** *${client.config.permLevels.find(l => l.level === level).name}* **${message.author.username}** *(${message.author.id})* detected cursing.`);
              client.logger.warn(`[Profanity] ${client.config.permLevels.find(l => l.level === level).name} ${message.author.username} (${message.author.id}) detected cursing.`);
              message.delete();
              return;
            }
        }
        if (settings.profanityMessage.includes("{{mention}}")) {
          const curseMessage = settings.profanityMessage.replace("{{mention}}", "<@" + message.author.id + ">");
            if (settings.profanityAlert === "true") {
              message.channel.send(curseMessage);
            }
            if (!log) {
              client.logger.warn(`[Profanity] ${client.config.permLevels.find(l => l.level === level).name} ${message.author.username} (${message.author.id}) detected cursing.`);
              message.delete();
              return;
            } else {
              message.guild.channels.find('name', settings.modLogChannel).send(`**[Profanity]** *${client.config.permLevels.find(l => l.level === level).name}* **${message.author.username}** *(${message.author.id})* detected cursing.`);
              client.logger.warn(`[Profanity] ${client.config.permLevels.find(l => l.level === level).name} ${message.author.username} (${message.author.id}) detected cursing.`);
              message.delete();
              return;
            }
        } else {
          if (settings.profanityAlert === "true") {
            message.channel.send(settings.profanityMessage);
          }
          if (!log) {
            client.logger.warn(`[Profanity] ${client.config.permLevels.find(l => l.level === level).name} ${message.author.username} (${message.author.id}) detected cursing.`);
            message.delete();
            return;
          } else {
            message.guild.channels.find('name', settings.modLogChannel).send(`**[Profanity]** *${client.config.permLevels.find(l => l.level === level).name}* **${message.author.username}** *(${message.author.id})* detected cursing.`);
            client.logger.warn(`[Profanity] ${client.config.permLevels.find(l => l.level === level).name} ${message.author.username} (${message.author.id}) detected cursing.`);
            message.delete();
            return;
          }
        }
      }
      else {
        return;
      }
    }
  }

  // Also good practice to ignore any message that does not start with our prefix,
  // which is set in the configuration file.
  if (message.content.indexOf(settings.prefix) !== 0) return;

  // Here we separate our "command" name, and our "arguments" for the command.
  // e.g. if we have the message "+say Is this the real life?" , we'll get the following:
  // command = say
  // args = ["Is", "this", "the", "real", "life?"]
  const args = message.content.slice(settings.prefix.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();

  // Check whether the command, or alias, exist in the collections defined
  // in app.js.
  const cmd = client.commands.get(command) || client.commands.get(client.aliases.get(command));
  // using this const varName = thing OR otherthign; is a pretty efficient
  // and clean way to grab one of 2 values!
  if (!cmd) return;

  // Some commands may not be useable in DMs. This check prevents those commands from running
  // and return a friendly error message.
  if (cmd && !message.guild && cmd.conf.guildOnly)
    return message.channel.send("This command is unavailable via private message. Please run this command in a guild.");

  if (level < client.levelCache[cmd.conf.permLevel]) {
    if (settings.systemNotice === "true") {
      return message.channel.send(`You do not have permission to use this command.
  Your permission level is ${level} (${client.config.permLevels.find(l => l.level === level).name})
  This command requires level ${client.levelCache[cmd.conf.permLevel]} (${cmd.conf.permLevel})`);
    } else {
      return;
    }
  }

  // To simplify message arguments, the author's level is now put on level (not member so it is supported in DMs)
  // The "level" command module argument will be deprecated in the future.
  message.author.permLevel = level;
  
  message.flags = [];
  while (args[0] && args[0][0] === "-") {
    message.flags.push(args.shift().slice(1));
  }
  // If the command exists, **AND** the user has permission, run it.
  client.logger.cmd(`[CMD] ${client.config.permLevels.find(l => l.level === level).name} ${message.author.username} (${message.author.id}) ran command ${cmd.help.name}`);
  cmd.run(client, message, args, level);
};

