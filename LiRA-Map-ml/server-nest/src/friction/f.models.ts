/* Created by Colin Hoffmann (s212711) */
//ELiot Ullmo

import { WayId, LatLngDist, Condition } from "src/models";

export interface FrictionMeta {
    friction_value: number;
	geometry: LatLngDist[];
	way_ids: WayId;


}

export interface FrictionDict{
	friction_values: number[];
	geometry: LatLngDist[][];


}
export interface FrictionConditions { 
	way_lengths: number[];
	way_ids: WayId[];
	geometry: LatLngDist[][];
	conditions: Condition[][];
}


export interface DistLength{

	way_dist:number;
	way_length:number;
}