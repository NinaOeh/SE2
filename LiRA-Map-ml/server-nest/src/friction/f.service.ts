/* Created by Colin Hoffmann (s212711) */

import { Injectable } from '@nestjs/common';
import { FrictionConditions, FrictionDict, FrictionMeta } from './f.models';
import { InjectConnection, Knex } from 'nestjs-knex';
import { Condition, LatLng, LatLngDist, WayId, WaysConditions } from 'src/models';
import { cursorTo } from 'readline';
import { Frictions, Geometry } from 'src/tables';
import groupBy from 'src/util';

@Injectable()
export class FrictionService {

    constructor(@InjectConnection('friction') private readonly knex: Knex) { }



   async getGeometry(): Promise<{[key: WayId]: LatLngDist[]}>{

    console.log("wwwwww");
    const res = await this.knex({public:'Friction'})
    .select( 'Way_id', 'mapped_lon as mapped_lon','mapped_lat as mapped_lat','friction_value')
    .whereNot('friction_value', 'Infinity')
    .andWhereNot('friction_value', 'NaN')
    .andWhereNot('mapped_lon','NaN')
    .andWhereNot('mapped_lat','NaN')

    console.log(res);




    const map=(curr)=>{
        if(curr){
            


            return { way_dist:10,lng:curr.mapped_lon,lat:curr.mapped_lat}
        }
        return { way_dist:0,lng:0,lat:0}
    }
    
    return groupBy( res, 'Way_id', map )
     
}



    async GetWaysFrictions(): Promise<{[key: WayId]: Condition[]}>{

        console.log("hello");

        const res = await Frictions(this.knex)
        .select( 'Way_id', 'friction_value as friction_value' )
        .whereNot('friction_value', 'Infinity')
        .andWhereNot('friction_value', 'NaN')
        .andWhereNot('mapped_lon','NaN')
        .andWhereNot('mapped_lat','NaN')

        const map=(curr)=>{
            if(curr){
                return {way_dist:1, value:curr.friction_value}
            }
            return { way_dist:0,value:0}
        }
    
        
        return groupBy( res, 'Way_id', map )
}
    async getWaysConditions(): Promise<WaysConditions>
    {
        const geometry = await this.getGeometry()
        console.log("11111")

        const conditions = await this.GetWaysFrictions()
        console.log("11111")


        const wayIds = Object.keys(conditions)


        return wayIds.reduce( 
            (acc, way_id) => {
                {
                    acc.way_ids.push(way_id)
                    acc.way_lengths.push(1)
                    acc.geometry.push(geometry[way_id])
                    acc.conditions.push(conditions[way_id])
                }
                return acc
            }, { way_ids: [], way_lengths: [], geometry: [], conditions: [] } as WaysConditions
        )
    }



    }













