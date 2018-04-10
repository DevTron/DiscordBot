const snek = require('snekfetch');

exports.run = async (client, message, args) => {
    	if(!args[1] || !args[0]) return message.channel.send({embed: { color: 0xff0404, author: {name: "Fortnite Stats", icon_url: "https://www.playerup.com/data/avatars/l/269/269045.jpg?1523286740"}, title: "Incorrect Parameters", description: "Correct usage\n!fstats <platform> <user>", footer: { icon_url: client.user.avatarURL, text: "© TheDevTron" } }});
	if(args[0].toLowerCase() !== "pc" && args[0].toLowerCase() !== "xbox") return message.channel.send({embed: { color: 0xff0404, author: {name: "Fortnite Stats", icon_url: "https://www.playerup.com/data/avatars/l/269/269045.jpg?1523286740"}, title: "Incorrect Parameters", description: "Correct usage\n!fstats <platform> <user>", footer: { icon_url: client.user.avatarURL, text: "© TheDevTron" } }});
	const platform = args[0].toLowerCase();
	const username = args[1].toLowerCase();
	snek.get(`http://fortnite.devtron.tv/user/${username}/lifetime/${platform}?raw=true`, { redirect: true }).then(res => {
		if (res.text === "Impossible to fetch User. User not found on this platform" || res.text === "Player Not Found") { return message.channel.send({ embed: { color: 0xff0404, author: {name: "Fortnite Stats", icon_url: "https://www.playerup.com/data/avatars/l/269/269045.jpg?1523286740"}, description: `User not found`, timestamp: new Date(), footer: { icon_url: client.user.avatarURL, text: "© TheDevTron"} } });}
		message.channel.send({embed: {
			color: 3447003,
			author: {
				name: "Fortnite Stats",
				icon_url: "https://www.playerup.com/data/avatars/l/269/269045.jpg?1523286740"
			},
			title: `${res.body.username}`,
			fields: [{
				name: "Kills",
				value: `${res.body.kills}`
			},
			{
				name: "Wins",
				value: `${res.body.wins}`
			},
			{
				name: "K/D",
				value: `${res.body.kd}`
			}
			],
			timestamp: new Date(),
			footer: {
				icon_url: client.user.avatarURL,
				text: "© TheDevTron"
			}
		}});
	}).catch(console.error);
};

exports.conf = {
    enabled: true,
    guildOnly: false,
    aliases: [],
    permLevel: "User"
  };
  
  exports.help = {
    name: 'fstats',
    category: "Gaming",
    description: 'Pulls the stats of a fortnite user.',
    usage: 'fstats <platform> <EPICusername>'
  };
