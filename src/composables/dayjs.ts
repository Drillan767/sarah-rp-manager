import dayjs from 'dayjs'
import 'dayjs/locale/fr'

export default function useDayjs() {
    dayjs.locale('fr')

    return dayjs
}
