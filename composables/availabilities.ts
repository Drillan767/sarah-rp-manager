import type { GenericDate, SpecificDate } from '@/types'

export default function useAvailabilities() {
    const dayjs = useDayjs()

    function parseTime(timeStr: string) {
        const [hour, minute] = timeStr.split(':').map(Number)
        return hour * 60 + minute
    }

    function calculateOverlap(periods: (SpecificDate | GenericDate)[]) {
        const overlaps = []
        console.log('test ?')

        for (let i = 0; i < periods.length; i++) {
            if (periods[i].isSpecific) {
                const specificPeriod = periods[i] as SpecificDate
                console.log(specificPeriod.begin)
                // ...
            }
            else {
                console.log(periods)
                for (let j = i + 1; j < periods.length; j++) {
                    console.log({ i, j })
                    const genericStartPeriod = periods[i] as GenericDate
                    const genericEndPeriod = periods[j] as GenericDate
                    const start1 = parseTime(genericStartPeriod.begin.hour)
                    const end1 = parseTime(genericStartPeriod.end.hour)
                    const start2 = parseTime(genericEndPeriod.begin.hour)
                    const end2 = parseTime(genericEndPeriod.end.hour)

                    console.log({ start1, start2, end1, end2 })

                    if (end1 > start2 && end2 > start1) {
                        const overlapStart = Math.max(start1, start2)
                        const overlapEnd = Math.min(end1, end2)
                        const overlapDuration = overlapEnd - overlapStart

                        overlaps.push({
                            period1: genericStartPeriod,
                            period2: genericEndPeriod,
                            duration: overlapDuration,
                        })
                    }
                }
            }
        }

        return overlaps
    }

    function retrieveDate(a: GenericDate | SpecificDate) {
        const fragment = 'du X au Y'
        let from = ''
        let to = ''
        if (a.isSpecific) {
            from = dayjs(a.begin).format('DD/MM/YYYY HH:mm')
            to = dayjs(a.end).format('DD/MM/YYYY HH:mm')
        }
        else {
            const { day: beginDay, hour: beginHour } = a.begin
            const { day: endDay, hour: endHour } = a.end
            from = `${beginDay} à ${beginHour}`
            to = `${endDay} à ${endHour}`
        }
        return `${fragment.replace('X', from).replace('Y', to)}`
    }

    function getSummary(data: (GenericDate | SpecificDate)[], type: 'available' | 'unavailable') {
        if (data[type].length === 0)
            return null
        let response = type === 'available' ? 'Disponible ' : 'Indisponible '
        if (data.length === 1) {
            return response += retrieveDate(formProxy.value[type][0])
        }
        else {
            formProxy.value[type].forEach((a, i) => {
                response += retrieveDate(a)
                if (i + 2 === formProxy.value[type].length)
                    response += ' et '

                else if (i + 1 !== formProxy.value[type].length)
                    response += ', '
            })

            return response
        }
    }

    return {
        parseTime,
        calculateOverlap,
    }
}
