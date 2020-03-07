const Discord = require('discord.js');
const bot = new Discord.Client()
const active = new Map();
const fs = require('fs');
bot.commands = new Discord.Collection();
bot.aliases = new Discord.Collection();

bot.logger = require("./modules/logger");
require("./modules/functions.js")(bot);

  fs.readdir("./commands/", (err, files) => {
   if(err) console.log(err);
   let jsfile = files.filter(f => f.split(".").pop() === "js")
   if(jsfile.length <= 0){
     console.log("Couldn't find commands.");
   return; 
  }
  
    jsfile.forEach((f, i) =>{
      let props = require(`./commands/${f}`); console.log(`${f} loaded!`);
      bot.commands.set(props.help.name, props);
      props.config.aliases.forEach(alias => {
      bot.aliases.set(alias, props.help.name);
    });
  });
});

// activity
bot.on('ready', function() {
    bot.user.setActivity(`a/help | ${bot.users.size} Users ${bot.guilds.size} Servers`)
    console.log(`[Ready!] With ${bot.users.size} Users And In ${bot.guilds.size} Servers!`)
});



  let ops = {
    active: active
  };


const db = require('quick.db')

bot.on('message', async message => {
  db.add(`globalMessages_${message.author.id}`, 1)
  db.add(`guildMessages_${message.guild.id}_${message.author.id}`, 1)
})

bot.on("message", async message => {
  this.config = require('./config.json')
  message.globalAdmin = !!this.config.owners.includes(message.author.id);
  if(message.author.bot) return;
  let prefix = 'a/'
  if (!message.content.startsWith(prefix)) return;
  let command = message.content.split(" ")[0].slice(prefix.length);
  let args = message.content.split(" ").slice(1);
  let cmd;
  if (bot.commands.has(command)) { 
      cmd = bot.commands.get(command);
    } else if (bot.aliases.has(command)) {
      cmd = bot.commands.get(bot.aliases.get(command));
    }

  if (cmd) {
    cmd.run(bot, message, args, ops);
  }
}); 
//change activity
bot.on("message",  message => {

  let args = message.content.split(" ").slice(1);

if(message.content === "a/setactivity")
bot.user.setActivity(args.join(" "))
});


//message delete
bot.on('messageDelete', async (message) => {
    const logs = message.guild.channels.find(b => b.name === 'message-log');
    if (message.guild.me.hasPermission('MANAGE_CHANNELS') && !logs) {
       // await message.guild.createChannel('logs', 'text');
    }
    if (!logs) {
        return console.log('The logs channel does not exist and cannot be created')
    }
    const entry = await message.guild.fetchAuditLogs({
        type: 'MESSAGE_DELETE'
    }).then(audit => audit.entries.first())
    let user;
    if (entry.extra.channel.id === message.channel.id && (entry.target.id === message.author.id) && (entry.createdTimestamp > (Date.now() - 5000)) && (entry.extra.count >= 1)) {
        user = entry.executor.username
    } else {
        user = message.author
    }
    const logembed = new Discord.RichEmbed()
        .setTitle('Message Deleted')
        .setAuthor(user.tag, message.author.displayAvatarURL)
        .addField(`**Message sent by ${message.author.username} deleted in ${message.channel.name}**\n\n**Message Content**`, message.content)
        .setColor(message.guild.member(bot.user).displayHexColor)
        .setFooter(`<#${message.channel.id}>`)
        .setTimestamp()
    //console.log(entry)
    logs.send(logembed);
})


//welcome
bot.on('guildMemberAdd', member => {
  const welcomeChannel = member.guild.channels.find( b => b.name === 'member-log');
  if (welcomeChannel) {
     let WelcomeEmbed = new Discord.RichEmbed()
    .setTitle("Member has joined!")
    .setThumbnail(member.user.displayAvatarURL)
    .setDescription(`Welcome ${member.user} to ${member.guild.name}, Follow The Rules And Enjoy Your Stay`)
    .setColor("#4286f4")
    .setFooter(`You Are Member #${member.guild.memberCount} To Join.`)
    .setTimestamp();
    welcomeChannel.send(WelcomeEmbed)
  } 
})
//leave
bot.on('guildMemberRemove', member => {
  const welcomeChannel = member.guild.channels.find( b => b.name === 'member-log');
  if (welcomeChannel) {
     let WelcomeEmbed = new Discord.RichEmbed()
    .setTitle("Member has Left!")
    .setThumbnail(member.user.displayAvatarURL)
    .setDescription(`Bye ${member.user}, See You Next Time!`)

     .setColor("#4286f4")
    .setTimestamp();
    welcomeChannel.send(WelcomeEmbed)
  } 
})


//message delete
bot.on('messageDelete', async (message) => {
    const logs = message.guild.channels.find(b => b.name === 'bot-spam');
    if (message.guild.me.hasPermission('MANAGE_CHANNELS') && !logs) {
    }
    if (!logs) {
        return console.log('The logs channel does not exist and cannot be created')
    }
    const entry = await message.guild.fetchAuditLogs({
        type: 'MESSAGE_DELETE'
    }).then(audit => audit.entries.first())
    let user;
    if (entry.extra.channel.id === message.channel.id && (entry.target.id === message.author.id) && (entry.createdTimestamp > (Date.now() - 5000)) && (entry.extra.count >= 1)) {
        user = entry.executor.username
    } else {
        user = message.author
    }
    const logembed = new Discord.RichEmbed()
        .setTitle('Message Deleted')
        .setAuthor(user.tag, message.author.displayAvatarURL)
        .addField(`**Message sent by ${message.author.username} deleted in ${message.channel.name}**\n\n**Message Content**`, message.content)
        .setColor(message.guild.member(bot.user).displayHexColor)
        .setFooter(`<#${message.channel.id}>`)
        .setTimestamp()
    //console.log(entry)
    logs.send(logembed);
})


//welcome
bot.on('guildMemberAdd', member => {
  const welcomeChannel = member.guild.channels.find( b => b.name === 'bot-spam');
  if (welcomeChannel) {
     let WelcomeEmbed = new Discord.RichEmbed()
    .setTitle("Member has joined!")
    .setThumbnail(member.user.displayAvatarURL)
    .setDescription(`Welcome ${member.user} to ${member.guild.name}, Follow The Rules And Enjoy Your Stay`)
    .setColor("#4286f4")
    .setFooter(`You Are Member #${member.guild.memberCount} To Join.`)
    .setTimestamp();
    welcomeChannel.send(WelcomeEmbed)
  } 
})
//leave
bot.on('guildMemberRemove', member => {
  const welcomeChannel = member.guild.channels.find( b => b.name === 'bot-spam');
  if (welcomeChannel) {
     let WelcomeEmbed = new Discord.RichEmbed()
    .setTitle("Member has Left!")
    .setThumbnail(member.user.displayAvatarURL)
    .setDescription(`Bye ${member.user}, See You Next Time!`)

     .setColor("#4286f4")
    .setTimestamp();
    welcomeChannel.send(WelcomeEmbed)
  } 
})

bot.on('guildMemberAdd', member => {
    member.guild.channels.get('524041429723381770').setName(`Total Users: ${member.guild.memberCount}`);
});

bot.on('guildMemberRemove', member => {
    member.guild.channels.get('524041429723381770').setName(`Total Users: ${member.guild.memberCount}`);
});
   
//Private Guild Member Count
bot.on('guildMemberAdd', member => {
    member.guild.channels.get('514870318553104424').setName(`Member Count: ${member.guild.memberCount}`);
});

bot.on('guildMemberRemove', member => {
    member.guild.channels.get('514870318553104424').setName(`Member Count: ${member.guild.memberCount}`);
});

require('dotenv').config();
var token = process.env.TOKEN;
bot.login(token);

bot.on('guildMemberAdd', member => {
  console.log('User' + member.user.tag + 'has joined the server!');

  var role = member.guild.roles.find(b => b.name === 'Member');
  member.addRole(role);
});
bot.on('guildCreate', guild => {
       let guildchannel = guild.channels;
    let channelID;
         Loop:
        for (let c of guildchannel) {
         let channelequals = c[1].type;
        if (channelequals === "text") {
          channelID = c[0];
        break Loop;
         }
       }
     let channel = bot.channels.get(guild.systemChannelID || channelID);
  
  let welcinfo = new Discord.RichEmbed()
  .setColor ("BLUE")
  .setTimestamp()
  .setTitle('Terimakasih telah mengundang saya ☺️')
  .addField('Prefix saya','a/', true)
  .addField('Gunakan','a/help', true)
  .addField('Melihat Info Bot', `https://discordbotlist.com/bots/522938514963300353`, true)
  .setFooter('Developers - 『ғᴍᴄ』𝓲𝓷𝓿𝓪𝓵𝓲𝓭-𝓾𝓼𝓮𝓻');
  channel.send(welcinfo);
  });
let xp = require("./xp.json");

bot.on('message', message => {
  let xpAdd = Math.floor(Math.random() * 7) + 8;
console.log(xpAdd);
if (message.author.bot) return;

if (!xp[message.author.id]) {
    xp[message.author.id] = {
        xp: 0,
        level: 1
    };
}

let curxp = xp[message.author.id].xp;
let curlvl = xp[message.author.id].level;
let nxtLvl = xp[message.author.id].level * 300;
xp[message.author.id].xp = curxp + xpAdd;
if (nxtLvl <= xp[message.author.id].xp) {
    xp[message.author.id].level = curlvl + 1;
  let lvlup = new Discord.RichEmbed()
  .setDescription(`<@${message.author.id}> Has Leveled Up`)
        .addField("New Level", curlvl + 1);

    message.channel.send(lvlup).then(msg => {
        msg.delete(10000)
    });
}
fs.writeFile("./xp.json", JSON.stringify(xp), (err) => {
            if (err) console.log(err)

})
})
