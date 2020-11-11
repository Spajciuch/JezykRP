const Discord = require("discord.js")
const { database } = require("firebase")

module.exports.run = async (client, message, args, embedColor, roles) => {
    if (!message.member.roles.cache.find(r => r.id == roles.warn || r.id == roles.zarząd)) return message.reply("nie masz wymaganych uprawnień")

    const memberID = args[0].replace("<", "").replace("@", "").replace("!", "").replace(">", "")
    if (!memberID || memberID.length !== 18) return message.reply("musisz oznaczyć osobę")

    const member = message.guild.members.cache.get(memberID)

    database().ref(`/warns/${memberID}`).once("value").then(wData => {
        const warnData = wData.val()

        if (!warnData) {
            const embed = new Discord.MessageEmbed()
                .setColor(embedColor)
                .setAuthor(member.user.tag, member.user.displayAvatarURL({ size: 1024, format: "png" }))
                .setDescription("Osoba nie była zgłaszana ani razu")
                .setFooter("© Copyright by Oskar Łysiak 2020-2021")
            return message.channel.send(embed)
        }

        let warns = warnData.warns
        let moderators = warnData.moderators
        let dates = warnData.dates

        let warnList = ""

        for (var i = 0; i <= warns.length - 1; i++) {
            warnList += `**${i + 1}.** ${dates[i]} • ${warns[i]} • ${moderators[i]}\n\n`
        }

        const embed = new Discord.MessageEmbed()
            .setColor(embedColor)
            .setAuthor(member.user.tag, member.user.displayAvatarURL({ size: 1024, format: "png" }))
            .addField("Poprzednie warny", warnList)
            .setDescription('Aby zdjąć warna wyślij w nastęnej wiadomości jego numer / "wszystko" / "anuluj"')
            .setFooter("© Copyright by Oskar Łysiak 2020-2021")
        message.channel.send(embed).then(() => {

            const filter = msg => msg.author.id == message.author.id
            const collector = new Discord.MessageCollector(message.channel, filter)

            collector.on("collect", msg => {
                const option = msg.content

                if (isNaN(option)) {
                    if (option == "wszystko") {
                        database().ref(`/warns/${memberID}`).remove().then(() => {
                            message.reply("pomyślnie usunięto wszystkie warny")
                        })
                    } else if (option == "anuluj") return message.reply("anulowano")
                } else if (option > 0 && option <= warns.length) {
                    warns.splice(option - 1, 1)
                    moderators.splice(option - 1, 1)
                    dates.splice(option - 1, 1)

                    database().ref(`/warns/${memberID}`).set({
                        warns: warns,
                        moderators: moderators,
                        dates: dates
                    }).then(() => {
                        message.reply("pomyślnie usunięto zgłoszenie")

                        warnList = ""

                        for (var i = 0; i <= warns.length - 1; i++) {
                            warnList += `**${i + 1}.** ${dates[i]} • ${warns[i]} • ${moderators[i]}\n\n`
                        }

                        const embed = new Discord.MessageEmbed()
                            .setColor(embedColor)
                            .setAuthor(member.user.tag, member.user.displayAvatarURL({ size: 1024, format: "png" }))
                            .addField("Poprzednie warny", warnList)
                            .setDescription('Aby zdjąć warna wyślij w nastęnej wiadomości jego numer / "wszystko" / "anuluj"')
                            .setFooter("© Copyright by Oskar Łysiak 2020-2021")
                        message.channel.send(embed)
                    })
                } else {
                    return message.reply('spróbuj ponownie, dostępne opcje to numer warna / "wszystko" / "anuluj')
                }
            })
        })
    })
}

module.exports.help = {
    name: "unwarn",
    category: "admin",
    info: "Usuń zgłoszenie użytownika, instrukcję otrzymasz po użyciu komendy"
}