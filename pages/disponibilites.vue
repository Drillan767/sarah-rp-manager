<template>
    <div class="p-5">

    <details class="p-5 dropdown mb-32 ml-100 text-white bg-blue-700 hover:bg-blue-800 focus:ring-40 focus:outline-none focus:ring-blue-4 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-400">
  <summary class="ml-100">Selection du Jour</summary>
  <ul class="p-2 shadow menu dropdown-content z-[1] bg-blue-500 rounded-box w-52">
    <li @click="test()"><span>Lundi</span></li>
    <li @click="display_availability('mardi')"><span >Mardi</span></li>
    <li><a>Mercredi</a></li>
    <li><a>Jeudi</a></li>
    <li><a>Vendredi</a></li>
    <li><a>Samedi</a></li>
    <li><a>Dimanche</a></li>
  </ul>
</details>
</div>
</template>
<script setup lang="ts">

import type { Database } from '@/types/supabase'
const supabase = useSupabaseClient<Database>()
const dayjs = useDayjs()
    async function display_availability(day : string)
    {
        console.log("saluit")
        const { data, error }: any = await supabase.from('users').select(`availability`)
        const falsef = "false"
        let heures = Array.from(Array(48).keys(), (x) => ([x, 0]))
        const weekday = ["dimanche", "lundi","mardi","mercredi","jeudi","vendredi","samedi"];
        data.forEach((d) =>
        {
            const { availability } = d
            console.log(d.availability.available)
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
                            heures[resultat][1] += 1;
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
            availability.unavailable.forEach((unavailable) =>
            {
                const ds = unavailable.begin
                const end = unavailable.end
                console.log(unavailable.begin)
                check_date(ds, end, weekday,2,day,heures)
            })
        });
        console.log(heures)
    }
    function thirty_or_zero(minute : Number, date : date)
    {
        if (minute > 0 && minute < 30)
            date = date - (minute - 30) * 60000
        else if (minute > 30)
            date = date - minute * 60000
            return (date)
    }
    function test()
    {
        console.log("hihi")
    }
    function check_date(ds: any, end: any, weekday: array, n : number, day: string, heures: array)
    {
      
        const tms = Date.now()
        let datenow = new Date(tms)
        datenow = datenow.getTime()
        const msremaining = (datenow % 86400000) + 7200000
        let date2 = new Date(ds)
        console.log("date2 : " + date2)
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
            console.log("n = " + n)
            let hourb = (((date2 % 86400000)/3600000) + 2) * 2
            let houre = (((date3 % 86400000)/3600000) + 2) * 2
            console.log(hourb + "--- " + houre)

            while (hourb < houre)
            {
                if (n === 1)
                heures[hourb][1] += 1;
                else
                {
                    console.log("avant " + heures[hourb][1])
                    heures[hourb][1] -= 1;
                    console.log("après " + heures[hourb][1])
                }
                hourb++;
            }
        }
    }
</script>
