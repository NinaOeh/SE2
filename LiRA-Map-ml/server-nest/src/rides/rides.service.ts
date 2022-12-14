
import { Injectable } from '@nestjs/common';
import { InjectConnection } from 'nestjs-knex';
import {  Knex } from 'knex';

import { RideMeta } from './models.rides';
import { BoundedPath, PointData } from 'src/models';
const to_knex = require('postgresql-to-knex')

@Injectable()
export class RidesService 
{
    constructor(@InjectConnection('lira-main') private readonly knex: Knex) {}

    async getRides(): Promise<RideMeta[]>
    {   
        return await this.knex
        .select( '*' )
        .from( { public: 'Trips' } )
        .whereNot( 'TaskId', 0 )
        .orderBy('TaskId')
        // this.knex.with('waypoints_alias', this.knex.select('*').from('MapReferences').whereRaw('"wayPointName" IS NOT NULL').andWhereRaw('("wayPointName" <> \'\') IS NOT FALSE'))
        // .with('measurements_alias', this.knex.select('MeasurementId', 'FK_Trip', 'wayPointName').distinctOn('FK_Trip').from('Measurements').join('waypoints_alias', function() {
        //     this.on('MeasurementId', '=', 'FK_MeasurementId')
        // }).orderBy('FK_Trip', 'asc'))
        // .select('Trips.*', 'wayPointName').from('Trips').join('measurements_alias', function() {
        //     this.on('TripId', '=', 'FK_Trip')
        // });
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

    async getRidesDownload(tripId: string, dbName: string ): Promise<any>
    {   
        const res = await this.knex
            .select('*')
            .from( { public: 'Measurements' } )
            .where( { 'FK_Trip': tripId, 'T': dbName } )
            .whereNot( { 'lat': null, 'lon': null } )

        const jsonData = JSON.parse(JSON.stringify(res));
        return jsonData
    }
}
