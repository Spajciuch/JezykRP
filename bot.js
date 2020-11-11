const Discord = require("discord.js")
const client = new Discord.Client({
    disableEveryone: true
})
const config = require("./config.json")

const chalk = require("chalk")
const fs = require("fs")
const firebase = require("firebase")

const muteListener = require("./listeners/muteListener.js")
const banListener = require("./listeners/banListener.js")
const clearListener = require("./listeners/clearListener.js")
const ticketListener = require("./listeners/ticketListener.js")

require("dotenv").config()

client.commands = new Discord.Collection()

fs.readdir(`./commands/`, async (err, files) => {
    if (err) console.log(chalk.red(`[error] ${err}`))
    const jsfile = files.filter(f => f.split(".").pop() == "js")

    if (jsfile.length <= 0) {
        console.log(chalk.red("[error] Nie znaleziono komend!"))
    }

    jsfile.forEach((f, i) => {
        const props = require(`./commands/${f}`)
        if (!props.help) return console.log(chalk.yellow(`[info] Wykryto nowy, nieprzygotowany plik komendy [${f}]`))

        console.log(chalk.cyan(`[Załadowano] ${f}`))
        client.commands.set(props.help.name, props)
    })
})

const firebaseConfig = {
    apiKey: process.env.API,
    authDomain: `${process.env.ID}.firebaseapp.com`,
    databaseURL: `https://${process.env.ID}.firebaseio.com`,
    projectId: `${process.env.ID}`,
    storageBucket: `${process.env.ID}.appspot.com`,
    messagingSenderId: `0445625173`,
    appId: `1:40445625173:web:03584062212fb6a1c7e5dc`
}

firebase.initializeApp(firebaseConfig)

client.on("ready", () => {
    muteListener.listener(client)
    muteListener.interval(client, client.guilds.cache.get(config.guild))
    
    banListener.listener(client)
    banListener.interval(client, client.guilds.cache.get(config.guild))

    clearListener.listener(client)
    clearListener.interval(client, client.guilds.cache.get(config.guild))

    ticketListener.run(client, config.channels)

    console.log(`[${client.user.username}] Połączono przy użyciu Discord API`)
    console.log(`[${client.user.username}] Obsługa ${client.guilds.cache.size} serwerów / ${client.users.cache.size} osób`)
})

client.on("message", message => {
    if (message.author.bot) return
    if (message.channel.type == "dm") return

    const embedColor = config.embedColor
    const prefix = config.prefix

    if (!message.content.startsWith(prefix)) return

    const messageArray = message.content.split(" ")
    const cmd = messageArray[0]
    const commandName = cmd.slice(prefix.length)
    const args = message.content.slice(prefix.length + commandName.length).trim().split(/ +/g)

    let commandfile = client.commands.get(cmd.slice(prefix.length)) ||
        client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName))

    if (commandfile) commandfile.run(client, message, args, embedColor, config.testRoles)
})

client.login(process.env.TOKEN)