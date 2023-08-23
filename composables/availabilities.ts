import type { Availability, GenericDate, SpecificDate } from '@/types'
import { days } from '@/assets/json/availability-time.json'

export default function useAvailabilities() {
    const dayjs = useDayjs()

    function parseTime(timeStr: string) {
        const [hour, minute] = timeStr.split(':').map(Number)
        return hour * 60 + minute
    }

    function halfHoursBetween(beginTimeStr: string, endTimeStr: string) {
        const beginMinutes = parseTime(beginTimeStr)
        const endMinutes = parseTime(endTimeStr)

        // Assuming that both the beginTime and endTime are in the same day
        const timeDifference = endMinutes - beginMinutes

        // Calculate the number of half hours
        const halfHours = Math.floor(timeDifference / 30)

        return halfHours
    }

    function calculateOverlap(availability: Availability, nbWeek?: number) {
        const currentWeek = nbWeek ?? dayjs().week()

        // One day (24h) has 48 half hours.
        // 48 x 7 = 336.
        const grid = Array.from(Array(336).keys(), () => 0)
        const { weekdays, weekends, available, unavailable } = availability

        if (weekdays) {
            const eveningHours = ['22:00', '22:30', '23:00', '23:30'].map(h => halfHoursBetween('00:00', h))

            for (let i = 0; i < 5; i++) {
                eveningHours.forEach((eh) => {
                    const gridIndex = i * 48 + eh
                    grid[gridIndex] = 1
                })
            }
        }

        if (weekends) {
            const saturday = 48 * 5
            for (let i = saturday; i < 336; i++)
                grid[i] = 1
        }

        available.forEach((a) => {
            if (a.isSpecific) {
                const begin = dayjs(a.begin)
                const end = dayjs(a.end)

                if ([begin.week(), end.week()].includes(currentWeek)) {
                    const beginIndex = 48 * (begin.get('d') - 1) + halfHoursBetween('00:00', begin.format('HH:mm'))
                    const endIndex = 48 * (end.get('d') - 1) + halfHoursBetween('00:00', end.format('HH:mm')) - 1

                    // We are about to reach the end of the grid.
                    if (beginIndex > endIndex) {
                        for (let i = beginIndex; i <= 335; i++)
                            grid[i] += 1

                        for (let j = 0; j <= endIndex; j++)
                            grid[j] += 1
                    }
                    else {
                        for (let i = beginIndex; i <= endIndex; i++)
                            grid[i] += 1
                    }
                }
            }
            else {
                const beginIndex = 48 * days.indexOf(a.begin.day) + halfHoursBetween('00:00', a.begin.hour)
                const endIndex = 48 * days.indexOf(a.end.day) + halfHoursBetween('00:00', a.end.hour)

                // We are about to reach the end of the grid.
                if (endIndex >= 0 && beginIndex > endIndex) {
                    for (let i = beginIndex; i <= 335; i++)
                        grid[i] += 1

                    for (let j = 0; j <= endIndex; j++)
                        grid[j] += 1
                }
                else {
                    for (let i = beginIndex; i <= endIndex; i++)
                        grid[i] += 1
                }
            }
        })

        unavailable.forEach((u) => {
            const begin = dayjs(u.begin)
            const end = dayjs(u.end)

            if ([begin.week(), end.week()].includes(currentWeek)) {
                const beginIndex = 48 * (begin.get('d') - 1) + halfHoursBetween('00:00', begin.format('HH:mm'))
                const endIndex = 48 * (end.get('d') - 1) + halfHoursBetween('00:00', end.format('HH:mm')) - 1

                // We are about to reach the end of the grid.
                if (beginIndex > endIndex) {
                    for (let i = beginIndex; i <= 335; i++)
                        grid[i] = grid[i] > 0 ? grid[i] - 1 : 0

                    for (let j = 0; j <= endIndex; j++)
                        grid[j] = grid[j] > 0 ? grid[j] - 1 : 0
                }
                else {
                    for (let i = beginIndex; i <= endIndex; i++)
                        grid[i] = grid[i] > 0 ? grid[i] - 1 : 0
                }
            }
        })

        return grid
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

        /* if (data[type].length === 0)
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
        } */
    }

    return {
        parseTime,
        calculateOverlap,
    }
}
