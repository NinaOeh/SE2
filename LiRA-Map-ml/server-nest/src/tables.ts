import * as Knex from "knex";
import { LatLngDist } from "./models";

interface Way {
    id: string;
    geom: any;
    ref: string;
    official_ref: string;
}

export const Ways = (k: Knex) => k.from<Way>('way')

interface RoadCondition {
    pk: any;
    way_id: string;
    way_dist: number;
    value: number;
    computed_at: Date;
    type: string;
}

export const RoadConditions = (k: Knex) => k.from<RoadCondition>('road_conditions')

interface ZoomCondition extends RoadCondition {
    zoom: number;
}

export const ZoomConditions = (k: Knex) => k.from<ZoomCondition>('zoom_conditions')

interface Friction {
    way_id: string;
    friction_value: number;
    geom: any;
    mapped_lat: number;
    mapped_lng: number;



};


export const Frictions = (k: Knex) => k.from<Friction>('Friction')

export const Geometry = (k: Knex) => k.from<LatLngDist[]>('Geometry')