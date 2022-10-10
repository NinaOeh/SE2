
import { Injectable } from '@nestjs/common';
import { InjectConnection } from 'nestjs-knex';
import { Knex } from 'knex';

import { RideMeta } from './models.rides';
import { BoundedPath, PointData } from 'src/models';

@Injectable()
export class RidesService 
{
    constructor(@InjectConnection('lira-main') private readonly knex: Knex) {}

    async getRides(): Promise<RideMeta[]>
    {   let knex = this.knex;
        return await this.knex
            // .select( '*' )
            // .from( { public: 'Trips' } )
            // .where( 'TaskId', 1472 )
            // .innerJoin('Measurements', function() {
            //     this.on('Measurements.FK_Trip', '=', 'TripId')
            //     // .andOn('Measurements.Created_Date', '=', knex.raw("(select max(Created_Date) from Measurements where Measurements.FK_Trip = TripId)"))
            //     }
            // )
            // .innerJoin('MapReferences', function() {
            //     this.on('MapReferences.FK_MeasurementId', '=', 'Measurements.MeasurementId')
            //     // .andOn('MapReferences.wayPointId', '!=', "")
            //     }
            // )
            // .distinct()
            // .orderBy('TaskId')

            .distinct()
            .select('MapReferences.wayPointName', 'Trips.*')
            .from('MapReferences')
            .whereNot('wayPointName', null)
            .whereNot('wayPointName', '')
            .innerJoin('Measurements', 'Measurements.MeasurementId', 'MapReferences.FK_MeasurementId')
            .innerJoin('Trips', 'Trips.TripId', 'Measurements.FK_Trip')
            .orderBy('wayPointName', 'asc')
    }

    async getRide( tripId: string, dbName: string ): Promise<BoundedPath>
    {
        console.log(tripId, dbName);
        
        const res = await this.knex
            .select( [ 'message', 'lat', 'lon', 'Created_Date' ] )
            .from( { public: 'Measurements' } )
            .where( { 'FK_Trip': tripId, 'T': dbName } )
            .whereNot( { 'lat': null, 'lon': null } )

        let minX = new Date(Number.MAX_SAFE_INTEGER).getTime();
        let maxX = new Date(Number.MIN_SAFE_INTEGER).getTime();
        let minY = Number.MAX_SAFE_INTEGER;
        let maxY = Number.MIN_SAFE_INTEGER;

        const path = res
            .map( (msg: any) => {
                const json = JSON.parse(msg.message);
                const value = json[dbName + '.value'];
                const timestamp = new Date( msg.Created_Date )

                minX = Math.min(minX, timestamp.getTime());
                maxX = Math.max(maxX, timestamp.getTime());
                minY = Math.min(minY, value)
                maxY = Math.max(maxY, value)

                return { lat: msg.lat, lng: msg.lon, value, metadata: { timestamp } } as PointData
            } )
            .sort( (a: PointData, b: PointData) =>
                a.metadata.timestamp - b.metadata.timestamp
            )

        return { path, bounds: { minX, maxX, minY, maxY } }
    }
}
