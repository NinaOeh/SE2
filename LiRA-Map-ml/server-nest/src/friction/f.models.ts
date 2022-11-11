/* Created by Colin Hoffmann (s212711) */

import { WayId, LatLngDist, Condition } from "src/models";

export interface FrictionMeta {
    lat: number,
    lon: number,
    friction_value: number
}


export interface FrictionConditions { 
	way_lengths: number[];
	way_ids: WayId[];
	geometry: LatLngDist[][];
	conditions: Condition[][];
}