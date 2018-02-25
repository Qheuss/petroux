const Discord = require('discord.js');
const cons = require('consolidate')
const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')

const adapter = new FileSync('database.json');
const db = low(adapter);

db.defaults({ histoires: [], xp: []}).write()

var bot = new Discord.Client({autoReconnect: true});
var prefix = ("!");
var randnum = 0;

var storynumber = db.get('histoires').map('story_value').value();

function generateHex() {
    return '#' + Math.floor(Math.random() * 16777215).toString(16);
}

var fortunes = [
    "oui",
    "non",
    "peut-être",
    "mdr ferme ta gueule",
    "heu... ptdr c'est quoi cette question de merde",
    "je sais pas moi... t'as cru j'avais la réponse à tout?",
    "j'en suis sûr",
    "bien sur que oui",
    "la réponse est déjà en toi...",
    "pas d'avis",
    "c'est ton destin",
    "d'après moi oui",
    "faut pas rêver",
    "mieux vaut ne pas te le dire...",
    "oui et non",
    "on connais tous la réponse...",
    "heu... je vais me taire",
    "qu'est-ce que j'en sais moi?",
    "croquette de fromage"
];

bot.on('ready', () => {
    bot.user.setPresence({ game: { name: ' --> !help', type: 0} });
    console.log("Bot opérationnel et en pleine santé!");
});

bot.login('NDE2OTE1Njk2MDQ0MjEyMjM0.DXLaiw.3PV-TP5sWp8tGvZYzW7kQ_e6AO4');

bot.on("disconnected", () => {
	console.log("Déconnecté!");
});

bot.on('error', (err) => {
    console.log("—— Erreur!!! ——");
    console.log(err);
});

bot.on("guildMemberAdd", member => {
    //member.guild.channels.find("name", "bienvenue").send(`Bienvenue sur le serveur! **${member.user.username}** :ok_hand:`)
        var bvn_embed = new Discord.RichEmbed()
        .setTitle(`Bienvenue sur le serveur __${member.user.username}__ ! :ok_hand: `)
        .setColor('GREEN')
        member.guild.channels.find("name", "bienvenue").sendEmbed(bvn_embed);
});

bot.on("guildMemberRemove", member => {
    //member.guild.channels.find("name", "bienvenue").send(`**${member.user.username}** --> Un brave parti trop tôt! :confused:`)
        var bye_embed = new Discord.RichEmbed()
        .setTitle(`Bye bye __${member.user.username}__ :thumbsdown:`)
        .setColor('RED')
        member.guild.channels.find("name", "bienvenue").sendEmbed(bye_embed);
});

bot.on('message', message => {

    var msgauthor = message.author.username.toString();

    if(message.author.bot)return;

    if(!db.get("xp").find({user: msgauthor}).value()){
        db.get("xp").push({user: msgauthor, xp: 1}).write();
    }else{
        var userxpdb = db.get("xp").filter({user: msgauthor}).find('xp').value();
        console.log(userxpdb);
        var userxp = Object.values(userxpdb)
        console.log(userxp);
        console.log(`Nombre d'xp: ${userxp[1]}`)

        db.get("xp").find({user: msgauthor}).assign({user: msgauthor, xp: userxp[1] += 1}).write();

    }

    if (message.content === "ping"){
        message.reply("pong");
        console.log('ping pong');
    }

    if (message.content === "ça va?"){
        random();

        if (randnum == 1){
            message.reply("bof");
            console.log(randnum);
        }

        if (randnum == 2){
            message.reply("oui");
            console.log(randnum);
        }

        if (randnum == 3){
            message.reply("non");
            console.log(randnum);
        }

        if (randnum == 4){
            message.reply("t'es qui toi?");
            console.log(randnum);
        }

        if (randnum == 5){
            message.reply("ta gueule!");
            console.log(randnum);
        }

        if (randnum == 6){
            message.reply("ça va et toi?");
            console.log(randnum);
        }

        if (randnum == 7){
            message.reply("je suis fatigué... :/");
            console.log(randnum);
        }

        if (randnum == 8){
            message.reply("Comme d'hab!");
            console.log(randnum);
        }

        if (randnum == 9){
            message.reply("je tiens le coup!");
            console.log(randnum);
        }

        if (randnum == 10){
            message.reply("ça ne pourrait pas aller mieux!");
            console.log(randnum);
        }

        if (randnum == 11){
            message.reply("et ta mère?");
            console.log(randnum);
        }
    }

    if (!message.content.startsWith(prefix)) return;
    var args = message.content.substring(prefix.length).split(" ");

    switch (args[0].toLowerCase()){
		
		case "8ball":
            if (args[1]) message.channel.sendMessage(fortunes[Math.floor(Math.random() * fortunes.length)]);
            else message.channel.sendMessage("la question?");
            break;

        case "newstory":
        var value = message.content.substr(10);
        var author = message.author.username.toString();
        var number = db.get('histoires').map('id').value();
        //var storyid = number + 1;
        console.log(value);
        message.reply("Ajout de l'histoire dans la DataBase")

        db.get('histoires')
            .push({ story_value: value, story_author: author})
            .write();
            break;

            case "tellstory":
            story_random();
            console.log(randnum);
            
            var story = db.get(`histoires[${randnum}].story_value`).toString().value();
            console.log(story);

            message.channel.send(`Voici l'histoire: ${story}`);

            break;


    }

    if (message.content === prefix + "help"){
        var help_embed = new Discord.RichEmbed()
                .setTitle("__Commandes:__")
                .setColor('BLUE')
				.setThumbnail("http://chicagopolicyreview.org/wp-content/uploads/2014/02/jacky.jpg")
				.addField("!8ball", "poser une question à la boule magique", false)
                .addField("ping", "pong", false)
                .addField("!xp", "voir son xp", false)
                .addField("ça va?", "prendre des nouvelles du bot", false)
				.addBlankField(true)
				.addField("🎶", "￼  ￼  ￼﻿", false)
				.addField("!play", "lancer la musique", false)
                .addField("!skip", "passer la musique", false)
                .addField("!stop", "arreter la musique", false)
                .addField("!pause", "mettre la musique sur pause", false)
                .addField("!resume", "relancer la musique", false)
                .addField("!volume", "changer/voir le volume de la musique", false)
                .addField("!np", "voir quelle musique est en train d'être jouée", false)
                .addField("!queue", "voir les musiques suivantes", false)
				.addBlankField(true)
				.addField("🌍", "￼  ￼  ￼﻿", false)
				.addField("Twitch", "https://www.twitch.tv/qheuss_", false)
				.setTimestamp()
        message.channel.sendEmbed(help_embed);
        console.log('Help');
    }

if (message.content === prefix + "xp"){
    var xp = db.get("xp").filter({user: msgauthor}).find('xp').value()
    var xpfinal = Object.values(xp);
    var xp_embed = new Discord.RichEmbed()
        .setTitle(`xp de ${message.author.username}`)
        .setDescription(`-- ${xpfinal[1]} xp --`)
        .setColor('GOLD')
    message.channel.send({embed: xp_embed});
}

});

function story_random(min, max) {
    min = Math.ceil(0);
    max = Math.floor(storynumber);
    randnum = Math.floor(Math.random() * (max - min +1) + min);
}

function random(min, max) {
    min = Math.ceil(0);
    max = Math.floor(11);
    randnum = Math.floor(Math.random() * (max - min +1) + min);
}
