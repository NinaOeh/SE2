// Colin Hoffmann (s212711)
//extended by Nina Oehlckers (s213535)

import { friction_download, post } from "./fetch"
import { Condition, WaysConditions } from "../models/path"

export const getFrictionConditions = (geometry: boolean, setWays: (data: WaysConditions) => void) => {
    console.log("WE ARE GOING TO RECIEVE DATA");
    post('/friction/ways', { geometry }, setWays);


    console.log("WE HAVE RECIEVE DATA");

}

export const getFrictConditions = (wayId: string, setConditions: (data: Condition[]) => void) => {
    console.log("hello1")
    post('/friction/way', { wayId }, setConditions)
    console.log("hello 2");

}


//Nina Oehlckers (s213535)
export const downloadFriction = async (maxlat: number, minlat: number, maxlon: number, minlon: number) => {
    const data = await friction_download('/friction/friction_download', maxlat, minlat, maxlon, minlon)
    return data
}

