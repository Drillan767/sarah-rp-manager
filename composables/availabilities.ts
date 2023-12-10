import type { Dayjs } from 'dayjs'
import type { Availability } from '~/types/models'
import { days } from '~/assets/json/availability-time.json'

export default function useAvailabilities() {
    const dayjs = useDayjs()

    function parseTime(timeStr: string) {
        const [hour, minute] = timeStr.split(':').map(Number)
        return hour * 60 + minute
    }

    function halfHoursBetween(beginTimeStr: string, endTimeStr: string) {
        const beginMinutes = parseTime(beginTimeStr)
        const endMinutes = parseTime(endTimeStr)
        let newDay = false
        // let nextDayOffset = 0

        // Check if the endTime is before the beginTime (spans across two days)
        if (endMinutes < beginMinutes) {
            // nextDayOffset = 24 * 60
            newDay = true
        }

        // Assuming that both the beginTime and endTime are in the same day
        const timeDifference = endMinutes - beginMinutes

        // Calculate the number of half hours
        const halfHours = Math.floor(timeDifference / 30)

        return { newDay, halfHours }
    }

    function calculateOverlap(availability: Availability, nbWeek?: number) {
        const currentWeek = nbWeek ?? dayjs().week()

        // One day (24h) has 48 half hours.
        // 48 x 7 = 336.
        const grid = Array.from(Array(336).keys(), () => 0)
        const { weekdays, weekends, available, unavailable } = availability

        if (weekdays) {
            const eventingHours = ['22:00', '22:30', '23:00', '23:30'].map((h) => {
                const { halfHours } = halfHoursBetween('00:00', h)
                return halfHours
            })

            for (let i = 0; i < 5; i++) {
                eventingHours.forEach((eh) => {
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
                    const [beginIndex, endIndex] = retrieveIndexes(begin, end)

                    // We are about to reach the end of the grid.
                    // TODO: Recheck this whole algorithm.
                    if (beginIndex > endIndex) {
                        for (let i = beginIndex; i <= 335; i++)
                            grid[i]++

                        for (let j = 0; j <= endIndex; j++)
                            grid[j]++
                    }
                    else {
                        for (let i = beginIndex; i <= endIndex; i++)
                            grid[i]++
                    }
                }
            }
            else {
                const { halfHours: halfHoursBegin } = halfHoursBetween('00:00', a.begin.hour)
                const { halfHours: halfHoursEnd } = halfHoursBetween('00:00', a.end.hour)

                const beginIndex = 48 * days.indexOf(a.begin.day) + halfHoursBegin
                const endIndex = 48 * days.indexOf(a.end.day) + halfHoursEnd - 1

                // We are about to reach the end of the grid.
                // TODO: Also recheck this whole algorithm.
                if (endIndex >= 0 && beginIndex > endIndex) {
                    for (let i = beginIndex; i <= 335; i++)
                        grid[i]++

                    for (let j = 0; j <= endIndex; j++)
                        grid[j]++
                }
                else {
                    for (let i = beginIndex; i <= endIndex; i++)
                        grid[i]++
                }
            }
        })

        unavailable.forEach((u) => {
            const begin = dayjs(u.begin)
            const end = dayjs(u.end)

            if ([begin.week(), end.week()].includes(currentWeek)) {
                const [beginIndex, endIndex] = retrieveIndexes(begin, end)

                // We are about to reach the end of the grid.
                // TODO: Recheck this whole algorithm.
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

    function retrieveIndexes(begin: Dayjs, end: Dayjs) {
        const { halfHours: halfHoursBegin } = halfHoursBetween('00:00', begin.format('HH:mm'))
        const { halfHours: halfHoursEnd } = halfHoursBetween('00:00', end.format('HH:mm'))

        const beginIndex = 48 * (begin.get('d') - 1) + halfHoursBegin
        const endIndex = 48 * (end.get('d') - 1) + halfHoursEnd - 1

        return [beginIndex, endIndex]
    }

    return {
        parseTime,
        calculateOverlap,
        halfHoursBetween,
    }
}
