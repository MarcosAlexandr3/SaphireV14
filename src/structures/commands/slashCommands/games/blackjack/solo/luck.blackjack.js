import { ButtonStyle } from 'discord.js'
import {
    SaphireClient as client,
    Database
} from '../../../../../../classes/index.js'
import { Emojis as e, economy } from '../../../../../../util/util.js'

export default async ({ interaction, BlackJackEmojis }) => {

    const { options, user, guild } = interaction
    const packs = options.getInteger('packs') || 2
    const bet = options.getInteger('bet') || 0
    const moeda = await guild.getCoin()
    const cards = []

    if (bet > 0) {

        const userMoney = await user.balance()

        if (userMoney < bet)
            return await interaction.reply({
                content: `${e.Deny} | Você não tem ${bet} ${moeda}`,
                ephemeral: true
            })

        economy.sub(user.id, bet)
    }

    for (let i = 0; i < packs; i++)
        cards.push(...BlackJackEmojis)

    cards.randomize()

    const firstCard = getCard()

    const msg = await interaction.reply({
        content: firstCard.emoji,
        embeds: [{
            color: client.blue,
            title: `${client.user.username}'s Blackjack`,
            fields: [
                {
                    name: `${e.baralho} Baralhos`,
                    value: `${packs} baralhos estão sendo usados`
                },
                {
                    name: '📑 Pontuação',
                    value: `\`${firstCard.value}/21\` - ${user.username}`
                },
                {
                    name: `${e.MoneyWings} Dinheiro apostado`,
                    value: `${bet} ${moeda}`
                }
            ]
        }],
        components: [
            {
                type: 1,
                components: [
                    {
                        type: 2,
                        label: 'Pegar',
                        emoji: e.Stonks,
                        custom_id: JSON.stringify({ c: 'bj', src: 'upcard' }),
                        style: ButtonStyle.Success
                    },
                    {
                        type: 2,
                        label: 'Ficar',
                        emoji: e.saphireOlhadinha,
                        custom_id: JSON.stringify({ c: 'bj', src: 'stand' }),
                        disabled: true,
                        style: ButtonStyle.Primary
                    },
                    {
                        type: 2,
                        label: 'Desistir',
                        emoji: e.saphireDesespero,
                        custom_id: JSON.stringify({ c: 'bj', src: 'giveup' }),
                        disabled: true,
                        style: ButtonStyle.Danger
                    }
                ]
            }
        ],
        fetchReply: true
    })

    return await Database.Cache.Blackjack.set(msg.id, {
        messageId: msg.id,
        userId: user.id,
        hand: [firstCard],
        pickUpHand: [],
        cards: cards,
        bet: bet,
        dealerHand: [getCard()]
    })

    function getCard() {
        const randomNumber = Math.floor(Math.random() * cards.length)
        const spliced = cards.splice(randomNumber, 1)
        return spliced[0]
    }

}