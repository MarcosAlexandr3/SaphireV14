import { time } from 'discord.js'
import parsems from 'parse-ms'

Date.prototype.constructor.GetTimeout = function (TimeToCooldown = 0, DateNowInDatabase = 0, style) {

    const TimestampStyles = {
        /**
         * Short time format, consisting of hours and minutes, e.g. 16:20
         */
        t: "t",
        /**
         * Long time format, consisting of hours, minutes, and seconds, e.g. 16:20:30
         */
        T: "T",
        /**
         * Short date format, consisting of day, month, and year, e.g. 20/04/2021
         */
        d: "d",
        /**
         * Long date format, consisting of day, month, and year, e.g. 20 April 2021
         */
        D: "D",
        /**
         * Short date-time format, consisting of short date and short time formats, e.g. 20 April 2021 16:20
         */
        f: "f",
        /**
         * Long date-time format, consisting of long date and short time formats, e.g. Tuesday, 20 April 2021 16:20
         */
        F: "F",
        /**
         * Relative time format, consisting of a relative duration format, e.g. 2 months ago
         */
        R: "R"
    }[style] || 't'

    const Time = ~~((TimeToCooldown + DateNowInDatabase) / 1000)

    return time(Time, TimestampStyles)
}

Date.prototype.constructor.Timeout = (TimeoutInMS = 0, DateNowAtDatabase = 0) => TimeoutInMS - (Date.now() - DateNowAtDatabase) > 0

Date.prototype.constructor.Timestamp = function (TimeInMs = 0, style, isDate) {

    const TimestampStyles = {
        /**
         * Short time format, consisting of hours and minutes, e.g. 16:20
         */
        t: "t",
        /**
         * Long time format, consisting of hours, minutes, and seconds, e.g. 16:20:30
         */
        T: "T",
        /**
         * Short date format, consisting of day, month, and year, e.g. 20/04/2021
         */
        d: "d",
        /**
         * Long date format, consisting of day, month, and year, e.g. 20 April 2021
         */
        D: "D",
        /**
         * Short date-time format, consisting of short date and short time formats, e.g. 20 April 2021 16:20
         */
        f: "f",
        /**
         * Long date-time format, consisting of long date and short time formats, e.g. Tuesday, 20 April 2021 16:20
         */
        F: "F",
        /**
         * Relative time format, consisting of a relative duration format, e.g. 2 months ago
         */
        R: "R"
    }[style] || 't'

    if (isDate) return time(TimeInMs, TimestampStyles)

    return time(new Date((Date.now() + TimeInMs) / 1000).valueOf(), TimestampStyles)

}

Date.prototype.constructor.format = function (DateInMs = 0, Shorted = false, withDateNow = true) {

    if (Shorted)
        return new Date(DateInMs + Date.now()).toLocaleString("pt-BR", { timeZone: "America/Sao_Paulo" })

    const date = withDateNow ? new Date(DateInMs + Date.now()) : new Date(DateInMs)

    return Intl.DateTimeFormat('pt-BR', { dateStyle: 'full', timeStyle: 'medium' }).format(date)
}

// Função para chegar a data de aniversário
Date.prototype.constructor.eightyYears = (formatBr = false) => {

    const date = new Date(Date.now() - 3155760000000) // 80 anos no passado
    const Dia = FormatNumber(date.getDate())
    const Ano = date.getFullYear()

    if (formatBr)
        return `${Dia}/${FormatNumber(date.getMonth() + 1)}/${Ano}`

    return `${Ano}-${FormatNumber(date.getMonth() + 1)}-${Dia}`
}

// Função para chegar a data de aniversário
Date.prototype.constructor.thirteen = (formatBr = false) => {

    const date = new Date(Date.now() - 410248800000) // 13 anos no passado
    const Dia = FormatNumber(date.getDate())
    const Ano = date.getFullYear()

    if (formatBr)
        return `${Dia}/${FormatNumber(date.getMonth() + 1)}/${Ano}`

    return `${Ano}-${FormatNumber(date.getMonth() + 1)}-${Dia}`

}

Date.prototype.constructor.stringDate = (ms) => {

    if (!ms || isNaN(ms)) return '0 segundo'

    const translate = {
        days: (n) => n > 1 ? 'dias' : 'dia',
        hours: (n) => n > 1 ? 'horas' : 'hora',
        minutes: (n) => n > 1 ? 'minutos' : 'minuto',
        seconds: (n) => n > 1 ? 'segundos' : 'segundo'
    }

    const date = parsems(ms)
    const entries = Object.entries(date)
    let result = ''

    for (let d of entries)
        if (d[1] > 0 && translate[d[0]])
            result += `${d[1]} ${translate[d[0]](d[1])} `
        else continue

    return result
}

function FormatNumber(data) {
    return data < 10 ? `0${data}` : data
}