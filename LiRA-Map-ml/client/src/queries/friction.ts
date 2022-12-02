/* Created by Colin Hoffmann (s212711) */

import { Dispatch, SetStateAction } from "react"
import { get, getFrict, getFriction, post } from "./fetch"
import { FrictionMeta } from "../models/models"
import { Condition, WaysConditions } from "../models/path"

export const getFrictionConditions = ( setWays: (data: WaysConditions) => void) => {
    console.log("WE ARE GOING TO RECIEVE DATA");
    getFriction('/friction/ways', setWays);


    console.log("WE HAVE RECIEVE DATA");

}

export const getFrictConditions = ( wayId: string, setConditions: (data: Condition[]) => void ) => {
    console.log("hello1")
    post( '/friction/way', { wayId }, setConditions )
    console.log("hello 2");

}

