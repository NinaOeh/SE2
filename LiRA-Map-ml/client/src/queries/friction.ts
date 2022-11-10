/* Created by Colin Hoffmann (s212711) */

import { Dispatch, SetStateAction } from "react"
import { get } from "./fetch"
import { FrictionMeta } from "../models/models"
import { Condition, WaysConditions } from "../models/path"

export const getFrictionConditions = ( setWays: (data: WaysConditions) => void) => {
    get('/friction', setWays)
}

