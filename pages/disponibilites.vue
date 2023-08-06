<template>
    <div>
    </div>
</template>
<script setup lang="ts">


import type { Database } from '@/types/supabase'
const dayjs = useDayjs()
display_availability("vendredi")
    async function display_availability(day : string)
    {
        const supabase = useSupabaseClient<Database>()
        const { data, error }: any = await supabase.from('users').select(`availability`)
      //  console.log(data[1].availability.available[0].begin.day) 
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
                        //console.log(heures)
                    }
                }
                else
                {
                    const ds = available.begin
                    const end = available.end

                    //console.log(ds)
                    //console.log(end)
                    const tms = Date.now()
                    let datenow = new Date(tms)
                    datenow = datenow.getTime()
                    const msremaining = (datenow % 86400000) + 7200000
                    //console.log("msremaning   " + msremaining)
                    let date2 = new Date(ds)
                    let date3 = new Date(end)
                    let tmp = datenow  - date2
                    tmp = Math.trunc(tmp/86400000);
                    let dayofweek = weekday[dayjs(ds).get('day')]
                   // console.log(dayofweek)
                    date2 = date2.getTime()
                    date3 = date3.getTime()
                    date2 = thirty_or_zero((date2 / 60000) % 60, date2)
                    date3 = thirty_or_zero((date3 / 60000) % 60, date3)
                    let resultat = date2 - datenow
                    let resultat2 = 604800000 -  msremaining
                    let resultat3 = 604800000 - (86400000 + msremaining)
                    console.log(resultat + " < " + resultat2)
                    console.log("resultat3 : " + resultat3)
                    if (((date2 - datenow) > 0)  && (((date2 - datenow ) < (604800000 - (86400000 + msremaining))) && (dayofweek === day)))
                    {
                        let hourb = (((date2 % 86400000)/3600000) + 2) * 2
                        let houre = (((date3 % 86400000)/3600000) + 2) * 2
                        console.log(hourb + "--- " + houre)
                        while (hourb < houre + 1)
                        {
                            heures[hourb][1] += 1;
                            hourb++;
                        }
                        console.log(heures)
                    }
                   
                }

            });
        });
    }
    function thirty_or_zero(minute : Number, date : date)
    {
        if (minute > 0 && minute < 30)
            date = date - (minute - 30) * 60000
        else if (minute > 30)
            date = date - minute * 60000
            return (date)
    }
</script>
