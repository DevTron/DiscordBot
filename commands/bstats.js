const blizzard = require('blizzard.js').initialize({ apikey: `v2raaypjk7pxj7r8tjazgv8vbbgnmzha` });

exports.run = async (client, message, args) => {
    const realm = args[0]
	const username = args[1]
	blizzard.wow.character(['items'], { origin: 'us', realm: `${realm}`, name: `${username}` })
		.then(response => {
			message.channel.send({embed: {
			color: 3447003,
			author: {
				name: "World of Warcraft Stats",
				icon_url: "https://www.techspot.com/images2/downloads/topdownload/2014/05/wow.png"
			},
			title: `LVL${response.data.level} ${response.data.name} - ${response.data.realm}`,
			fields: [{
				name: "iLvl",
				value: `${response.data.items.averageItemLevel}`
			},
			{
				name: "Equipped iLvl",
				value: `${response.data.items.averageItemLevelEquipped}`
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
    name: 'blvl',
    category: "Gaming",
    description: 'Pulls the stats of a WoW user.',
    usage: 'blvl <realm> <username>'
  };
