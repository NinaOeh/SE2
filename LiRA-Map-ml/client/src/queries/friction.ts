/* Created by Colin Hoffmann (s212711) */

import { Dispatch, SetStateAction } from "react"
import { get, getFriction } from "./fetch"
import { FrictionMeta } from "../models/models"
import { Condition, WaysConditions } from "../models/path"

export const getFrictionConditions = ( setWays: (data: WaysConditions) => void) => {
    console.log("WE ARE GOING TO RECIEVE DATA");
    getFriction('/friction', setWays);


    console.log("WE HAVE RECIEVE DATA");

}

