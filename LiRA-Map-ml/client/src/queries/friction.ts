/* Created by Colin Hoffmann (s212711) */

import { Dispatch, SetStateAction } from "react"
import { get } from "./fetch"
import { FrictionMeta } from "../models/models"

export const getFriction = (callback: Dispatch<SetStateAction<FrictionMeta[]>>) => {
    get('/friction', callback)
}
