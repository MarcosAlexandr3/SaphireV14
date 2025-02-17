import {
    SaphireClient as client,
    Database
} from '../../classes/index.js'
import { WebhookClient } from 'discord.js'
import { Emojis as e } from '../../util/util.js'
import { Api } from '@top-gg/sdk'
import { CodeGenerator } from '../../functions/plugins/plugins.js'

export default async (userId) => {

    if (!userId) return

    const user = await client.users.fetch(userId)
    if (!user) return
    giveRewards()

    const TopGGApi = new Api(process.env.TOP_GG_TOKEN)
    const votes = await TopGGApi.getVotes() || []
    const webhook = new WebhookClient({ url: process.env.PRIMARY_WEEBHOOK_LINK })

    webhook.send({
        content: `+1 voto para Saphire Moon#5706 de ${user.tag} \`${userId || 0}\` (${votes.length})`,
        avatarURL: 'https://media.discordapp.net/attachments/893361065084198954/1005310889588703332/top.gg_logo.png?width=484&height=484',
        username: 'Top GG Vote Notification'
    })

    const cachedData = await Database.Cache.General.get(`${client.shardId}.TopGG`)

    const data = cachedData?.find(data => data?.userId === userId)
    await Database.Cache.General.pull(`${client.shardId}.TopGG`, data => data.userId === userId)
    if (!data) return giveRewards()

    const channel = await client.channels.fetch(data.channelId)
    if (!channel) return

    const message = await channel.messages.fetch(data.messageId)
    if (!message) return

    const embed = message.embeds[0]?.data
    if (!embed) return

    embed.description = `${e.Check} | Recebi seu voto e te dei **+5000 ${await channel.guild.getCoin()}** e **+1000 XP ${e.RedStar}**`
    embed.color = client.green

    if (data.isReminder) {

        new Database.Reminder({
            id: CodeGenerator(7).toUpperCase(),
            userId: userId,
            RemindMessage: `Voto disponível no ${e.topgg} Top GG.`,
            Time: 43200000,
            DateNow: Date.now(),
            isAutomatic: true,
            ChannelId: channel.id
        }).save()

        embed.description += `\n${e.Notification} | Como você ativou o lembrete automático, vou te lembrar ${Date.GetTimeout(43200000, Date.now(), 'R')}`

    }

    return message.edit({ embeds: [embed], components: [] }).catch(() => { })

    async function giveRewards() {

        await Database.User.updateOne(
            { id: userId },
            {
                $inc: {
                    Balance: 5000,
                    Xp: 1000
                },
                $push: {
                    Transactions: {
                        $each: [{
                            time: `${Date.format(0, true)} - TOP GG`,
                            data: `${e.gain} Votou no Top.GG e ganhou 5000 Safiras`
                        }],
                        $position: 0
                    }
                }
            },
            { upsert: true }
        )

    }
}