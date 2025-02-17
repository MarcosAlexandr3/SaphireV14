import {
    SaphireClient as client,
    Database
} from "../../../../classes/index.js"
import {
    Emojis as e,
    economy
} from "../../../../util/util.js"

export default async (interaction, { confirmated, value }) => {

    const { message, guild } = interaction
    const author = message.interaction.user

    const userId = confirmated.filter(id => id !== author.id)[0]
    const user = client.users.resolve(userId)

    economy.add(userId, value, `${e.gain} Recebeu um pagamento de ${value} Safiras de ${author.tag} \`${author.id}\``)

    await Database.User.updateOne(
        { id: author.id },
        {
            Transactions: {
                $each:
                    [{
                        time: `${Date.format(0, true)}`,
                        data: `${e.loss} Pagou ${value} Safiras para ${user.tag} \`${user.id}\``
                    }],
                $position: 0
            }
        }
    )

    await Database.Cache.Pay.delete(`${author.id}.${message.id}`)
    return await interaction.update({
        content: `${e.Check} | Pagamento realizado com sucesso.\n${e.saphireRight} | <@${author.id}> enviou **${value.currency()} ${await guild.getCoin()}** para <@${user.id}>.`,
        components: []
    })
}