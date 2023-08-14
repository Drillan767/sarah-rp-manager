<template>
    <div class="p-5">

    <details ref="dateSelect" class="p-5 dropdown mb-32 ml-100 text-white bg-blue-700 hover:bg-blue-800 focus:ring-40 focus:outline-none focus:ring-blue-4 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-400">
  <summary class="ml-100">Selection du Jour</summary>
  <div><ul class="p-2 shadow menu dropdown-content z-[1] bg-blue-500 rounded-box w-52">
    <li><a @click="display_availability('lundi')">Lundi</a></li>
    <li><a @click="display_availability('mardi')">Mardi</a></li>
    <li><a @click="display_availability('mercredi')">Mercredi</a></li>
    <li><a @click="display_availability('jeudi')">Jeudi</a></li>
    <li><a @click="display_availability('vendredi')">Vendredi</a></li>
    <li><a @click="display_availability('samedi')">Samedi</a></li>
    <li><a @click="display_availability('dimanche')">Dimanche</a></li>
  </ul></div>
    </details>
    <div></div>
        <div v-if="selectedday !== ''"  class="w-full h-60" ><Bar :data="display_graph()" :options="options"/></div>
</div>

</template>
<script setup lang="ts" >
import Chart from 'chart.js/auto';
import * as chartConfig from './chartConfig.js'
import type { Database } from '@/types/supabase'
import { Bar } from 'vue-chartjs'
import {Chart as ChartJS, ArcElement,Title,Tooltip,Legend,BarElement,CategoryScale,LinearScale} from 'chart.js'
let heures = ref(Array.from(Array(48).keys(), (x) => ([x, 0])))
ChartJS.register(BarElement, Tooltip, Legend,CategoryScale,LinearScale)
const options = {responsive: true, maintainAspectRatio: false, title:{display: true, text:"Coucou"}, width: 800, height: 300 }
const selectedday = ref("") 
const supabase = useSupabaseClient<Database>()
const dayjs = useDayjs()
const dateSelect = ref()

    async function display_availability(day : string)
    {
        dateSelect.value.removeAttribute("open");
        selectedday.value = day
        initialize_table(heures)
        const { data, error }: any = await supabase.from('users').select(`availability`)
        const weekday = ["dimanche", "lundi","mardi","mercredi","jeudi","vendredi","samedi"];
        data.forEach((d) =>
        {
            const { availability } = d
           if (availability && availability.available)
           {
            availability.available.forEach((available) =>
            {
                if (available.isSpecific === false)
                {
                    if (available.begin.day.toLowerCase() === day)
                    {
                        const hourb = available.begin.hour
                        const houre = available.end.hour
                        let resultat  : number = ((Number(hourb[0]*10) + Number(hourb[1])) *2  + Number(hourb[3]/3)) 
                        let resultat2 : number = ((Number(houre[0]*10) + Number(houre[1])) *2  + Number(houre[3]/3))  
                        if (resultat2 < resultat)
                        resultat2 = 48;
                        while (resultat < resultat2)
                        {
                            heures.value[resultat][1] += 1;
                            resultat++;
                        }
                    }
                }
                else
                {
                    const ds = available.begin
                    const end = available.end
                    check_date(ds, end, weekday, 1,day,heures)
                }
            });
        }
            if (availability && availability.unavailable)
            {
                availability.unavailable.forEach((unavailable) =>
                {
                    const ds = unavailable.begin
                    const end = unavailable.end
                    check_date(ds, end, weekday,2,day,heures)
                })
            }
            });
        
        display_graph(day)
    }
    function thirty_or_zero(minute : Number, date : date)
    {
        if (minute > 0 && minute < 30)
            date = date - (minute - 30) * 60000
        else if (minute > 30)
            date = date - minute * 60000
            return (date)
    }
    function check_date(ds: any, end: any, weekday: array, n : number, day: string, heures: array)
    { 
        const tms = Date.now()
        let datenow = new Date(tms)
        datenow = datenow.getTime()
        const msremaining = (datenow % 86400000) + 7200000
        let date2 = new Date(ds)
        let date3 = new Date(end)
        let tmp = datenow  - date2
        tmp = Math.trunc(tmp/86400000);
        let dayofweek = weekday[dayjs(ds).get('day')]
        date2 = date2.getTime()
        date3 = date3.getTime()
        date2 = thirty_or_zero((date2 / 60000) % 60, date2)
        date3 = thirty_or_zero((date3 / 60000) % 60, date3)
        let resultat = date2 - datenow
        let resultat2 = 604800000 -  msremaining
        let resultat3 = 604800000 - (86400000 + msremaining)
        if (((date2 - datenow) > 0)  && (((date2 - datenow ) < (604800000 - (86400000 + msremaining))) && (dayofweek === day)))
        {
            let hourb = (((date2 % 86400000)/3600000) + 2) * 2
            let houre = (((date3 % 86400000)/3600000) + 2) * 2
            while (hourb < houre)
            {
                if (n === 1)
                    heures.value[hourb][1] += 1;
                else
                    heures.value[hourb][1] -= 1;
                hourb++;
            }
        }
    }
        function display_graph()
        {
            const data = {
            labels: ['00h00', '00h30', '1h00', '1h30', '2h00', '02h30', '3h00', '3h30', '4h00', '4h30','05h00', '05h30', '6h00', '6h30', '7h00','07h30', '08h00', '8h30', '9h00', '9h30','10h00', '10h30', '11h00', '11h30', '12h00','12h30', '13h00', '13h30', '14h00', '14h30','15h00', '15h30', '16h00', '16h30', '17h00','17h30', '18h00', '18h30', '19h00', '19h30','20h00', '20h30', '21h00', '21h30', '22h00','22h30', '23h00', '23h30'],
            datasets: [
            {
            label: selectedday.value.toUpperCase(),
           // width: '500px',
            backgroundColor: 'blue',
            data: [heures.value[0][1], heures.value[1][1], heures.value[2][1], heures.value[3][1], heures.value[4][1], heures.value[5][1],heures.value[6][1], heures.value[7][1], heures.value[8][1],heures.value[9][1], heures.value[10][1], heures.value[11][1], heures.value[12][1],heures.value[13][1], heures.value[14][1], heures.value[15][1],heures.value[16][1], heures.value[17][1], heures.value[18][1], heures.value[19][1],heures.value[20][1], heures.value[21][1], heures.value[22][1],heures.value[23][1], heures.value[24][1], heures.value[25][1], heures.value[26][1],heures.value[27][1], heures.value[28][1], heures.value[29][1],heures.value[30][1], heures.value[31][1], heures.value[32][1], heures.value[33][1],heures.value[34][1], heures.value[35][1], heures.value[36][1],heures.value[37][1],heures.value[38][1], heures.value[39][1], heures.value[40][1],heures.value[41][1],heures.value[42][1], heures.value[43][1], heures.value[44][1],heures.value[45][1], heures.value[46][1], heures.value[47][1]]
            }
        ]
             }
             return (data)
        }
        function initialize_table(heures : array)
        {
            let a = 0;
            while(a < 48)
            {
                heures.value[a][1] = 0;
                a++;
            }
        }  
</script>
