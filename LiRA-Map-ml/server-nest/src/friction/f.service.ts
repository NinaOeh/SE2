/* Created by Colin Hoffmann (s212711) */

import { Injectable } from '@nestjs/common';
import { FrictionConditions, FrictionMeta } from './f.models';
import { InjectConnection, Knex } from 'nestjs-knex';
import { Condition, LatLngDist, WaysConditions } from 'src/models';
import { cursorTo } from 'readline';
import { Frictions } from 'src/tables';

@Injectable()
export class FrictionService {

    constructor(@InjectConnection('friction') private readonly knex: Knex) { }

    async getFriction(): Promise<FrictionMeta[]> {
        console.log("We are in the friction service")
        const frictions = await Frictions(this.knex)
            .select('lat', 'lot', 'friction_value')
            //.select('*')
        
       // .whereNot('friction_value', 'Infinity')
        //.andWhereNot('friction_value', 'NaN')
        const friction=frictions[0]

        console.log("we are getting:",friction);
        return frictions;
        

    }


    async getFrictionConditions(): Promise<FrictionConditions>
    {
        const friction = await this.getFriction()
       
        return friction.reduce( 
            (acc, curr) => {
                {                                                                                       
                    const geo:LatLngDist[]=[{way_dist:1,lat:curr.lat,lng:curr.lon}];
                    const c:Condition[]=[{way_dist:1,value:curr.friction_value}];
                    acc.way_ids.push("0")
                    acc.way_lengths.push(1)
                    acc.geometry.push(geo)
                    acc.conditions.push(c)
                }
                return acc
            }, { way_ids: [], way_lengths: [], geometry: [], conditions: [] } as FrictionConditions
        )
    }





}