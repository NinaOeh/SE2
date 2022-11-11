/* Created by Colin Hoffmann (s212711) */

import { Dispatch, SetStateAction } from "react"
import { get } from "./fetch"
import { FrictionMeta } from "../models/models"
import { Condition, WaysConditions } from "../models/path"

export const getFrictionConditions = ( setWays: (data: WaysConditions) => void) => {
    console.log("WE ARE GOING TO RECIEVE DATA");
    get('/friction', setWays)
    fetch("http://lirase2.compute.dtu.dk:3002/friction")
    .then(res => res.json())
    .then(data => console.log("receive fric?",data));


    console.log("WE HAVE RECIEVE DATA");

}

