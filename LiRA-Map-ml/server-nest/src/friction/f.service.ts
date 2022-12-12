/* Created by Colin Hoffmann (s212711) */
//ELiot Ullmo
//extended by Nina Oehlckers (s213535)

import { Injectable } from '@nestjs/common';
import { InjectConnection, Knex } from 'nestjs-knex';
import { Condition, LatLng, LatLngDist, WayId, WaysConditions } from 'src/models';
import { cursorTo } from 'readline';
import { Frictions, Geometry } from 'src/tables';
import groupBy from 'src/util';

@Injectable()
export class FrictionService {

    constructor(@InjectConnection('friction') private readonly knex: Knex) { }

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

    //Nina Oehlckers (s213535)
    async FrictionDownload(maxlat: number,minlat:number, maxlon: number,minlon:number): Promise<any>{

        const res = await Frictions(this.knex)
        .select('*')
        .whereNot('friction_value', 'Infinity')
        .andWhereNot('friction_value', 'NaN')
        .andWhereNot('mapped_lon','NaN')
        .where('mapped_lon','>=',minlon)
        .andWhere('mapped_lon','<=',maxlon)
        .andWhereNot('mapped_lat','NaN')
        .andWhere('mapped_lat','>=',minlat)
        .andWhere('mapped_lat','<=',maxlat)

        const jsonData = JSON.parse(JSON.stringify(res));
        return jsonData
    }

    async GetWaysFrictions(): Promise<[{[key: WayId]: Condition[]},{[key: WayId]: LatLngDist[]}]>{


        const res = await Frictions(this.knex)
        .select( 'Way_id', 'friction_value as friction_value' ,'mapped_lat as lat','mapped_lon as log' )
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

        const map2=(curr)=>{
            if(curr){
                return {lat:curr.lat, lng:curr.log, way_dist:0}
            }
            return { lat:0,lng:0,way_dist:0}
        }    
        
        return [groupBy( res, 'Way_id', map ),
        groupBy( res, 'Way_id', map2 )]
}
    async getWaysConditions(geometry:boolean): Promise<WaysConditions>
    {   

        const [conditions,newpoints] = await this.GetWaysFrictions()



        const [frictions, frictions_lengths]= await this.GetDistLength()

        const g=String(geometry)
        if(g==="true"){
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
        else{

            console.log("newpoints")

            const wayIds = Object.keys(newpoints)

            return wayIds.reduce( 
                (acc, way_id) => {
                    {   
                        
                            acc.way_ids.push(way_id)
                            acc.way_lengths.push(frictions_lengths[way_id])
                            acc.geometry.push(newpoints[way_id])
                            acc.conditions.push(conditions[way_id])
                        
                    
                    
                    }
                    return acc
                }, { way_ids: [], way_lengths: [], geometry: [], conditions: [] } as WaysConditions
            )
        }
    }


    
    async getWayFrictionConditions(way_id: string): Promise<Condition[]>
    {

        const [conditions,geometry] = await this.GetWaysFrictions()
        return conditions[way_id];


    }



    }













