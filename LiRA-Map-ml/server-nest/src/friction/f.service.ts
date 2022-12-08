/* Created by Colin Hoffmann (s212711) */

import { Injectable } from '@nestjs/common';
import { DistLength, FrictionConditions, FrictionDict, FrictionMeta } from './f.models';
import { InjectConnection, Knex } from 'nestjs-knex';
import { Condition, LatLng, LatLngDist, WayId, WaysConditions } from 'src/models';
import { cursorTo } from 'readline';
import { Frictions, Geometry } from 'src/tables';
import groupBy from 'src/util';

@Injectable()
export class FrictionService {

    constructor(@InjectConnection('friction') private readonly knex: Knex) { }

/** 

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
     
}*/


    async  GetDistLength(): Promise<[{[key: WayId]: LatLngDist[]}, {[key: WayId]: number}]>{

        const geom = await this.knex({public:'Geometry'})
            .select( 
                'Way_id as Way_id', 
                this.knex.raw('ST_AsGeoJSON((ST_DumpPoints(geometry)).geom)::json->\'coordinates\' as pos'), 
                this.knex.raw('ST_LineLocatePoint(geometry, (ST_DumpPoints(geometry)).geom) as way_dist'),
                this.knex.raw('ST_Length(geometry::geography) as length'),
                //this.knex.raw('ST_Intersection(geometry,(ST_DumpPoints(geometry)).geom) as intersec')
            )


            return [
                groupBy<any, LatLngDist>( geom, 'Way_id', (cur: any) => ({ lat: cur.pos[1], lng: cur.pos[0], way_dist: cur.way_dist}) ),
                geom.reduce( (acc, cur) => { acc[cur.Way_id] = cur.length; return acc }, {} ),
                //groupBy<any, any>( geom, 'Way_id', (cur: any) => (cur.intersec) ),

            ]



        
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
        console.log("11111")

        const conditions = await this.GetWaysFrictions()
        console.log("11111")



        const [frictions, frictions_lengths]= await this.GetDistLength()

        const wayIds = Object.keys(conditions)


        return wayIds.reduce( 
            (acc, way_id) => {
                {
                    acc.way_ids.push(way_id)
                    acc.way_lengths.push(frictions_lengths[way_id])
                    acc.geometry.push(frictions[way_id])
                    acc.conditions.push(conditions[way_id])
                }
                return acc
            }, { way_ids: [], way_lengths: [], geometry: [], conditions: [] } as WaysConditions
        )
    }


    
    async getWayFrictionConditions(way_id: string): Promise<Condition[]>
    {
        console.log('im trying');
        const conditions = await this.GetWaysFrictions()
        console.log(conditions[way_id])
        return conditions[way_id];


    }



    }













