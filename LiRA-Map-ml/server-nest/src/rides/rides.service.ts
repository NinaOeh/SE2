
import { Injectable } from '@nestjs/common';
import { InjectConnection } from 'nestjs-knex';
import { Knex } from 'knex';

import { RideMeta } from './models.rides';
import { BoundedPath, PointData } from 'src/models';
const to_knex = require('postgresql-to-knex')

@Injectable()
export class RidesService 
{
    constructor(@InjectConnection('lira-main') private readonly knex: Knex) {}

    async getRides(): Promise<RideMeta[]>
    {   //let knex = this.knex;
        console.log("Starting knex thingy")
        // console.log(to_knex('with wayPoints AS (SELECT * FROM public."MapReferences" WHERE "wayPointName" IS NOT NULL AND "wayPointName" IS NOT NULL), measurementsWith AS (SELECT DISTINCT ON ("FK_Trip") "MeasurementId","FK_Trip", "wayPointName" FROM public."Measurements" JOIN wayPoints ON "MeasurementId" = "FK_MeasurementId" ORDER BY "FK_Trip" ASC) SELECT "Trips".*, "wayPointName" FROM public."Trips" JOIN measurementsWith ON "TripId" = "FK_Trip"'))
        console.log("Done with knex thingy")

        //Winger den med with
        return await 
        this.knex.with('waypoints_alias', this.knex.select('*').from('MapReferences').whereRaw('"wayPointName" IS NOT NULL'))
        .with('measurements_alias', this.knex.select('MeasurementId', 'FK_Trip', 'wayPointName').distinctOn('FK_Trip').from('Measurements').join('waypoints_alias', function() {
            this.on('MeasurementId', '=', 'FK_MeasurementId')
        }).orderBy('FK_Trip', 'asc'))
        .select('Trips.*', 'wayPointName').from('Trips').join('measurements_alias', function() {
            this.on('TripId', '=', 'FK_Trip')
        });
        
        //Det her virker vidst - skal have tilføjet et where not ''
        return await 
        this.knex.with('waypoints_alias', this.knex.select('*').from('MapReferences').whereRaw('"wayPointName" IS NOT NULL'))
        .select('MeasurementId', 'FK_Trip', 'wayPointName').distinctOn('FK_Trip').from('Measurements').join('waypoints_alias', function() {
            this.on('MeasurementId', '=', 'FK_MeasurementId')
        }).orderBy('FK_Trip', 'asc');
        // .select('Trips.*', 'wayPointName').from('Trips').join('measurements_alias', function() {
        //     this.on('TripId', '=', 'FK_Trip')
        // });

        //Alt kombineret med thens
        // return await this.knex.select('Trips.*', 'wayPointName').from('Trips')
        // .join(((knex) => knex.select('FK_Trip', 'MeasurementId', 'FK_Trip', 'wayPointName').distinctOn('FK_Trip').from('Measurements')
        //     .join(((knex) => knex.select('*').from('MapReferences').whereRaw('MapReferences.wayPointName IS NOT NULL').andWhereNot('MapReferences.wayPointName', '').as('wayPoints')), function() {
        //     this.on('MeasurementId', '=', 'FK_MeasurementId')
        // }).orderBy('FK_Trip', 'asc').as('measurementsJoinWayPoints'))
        // , function() {
        //     this.on('TripId', '=', 'FK_Trip')
        // });


        // const wayPoints = this.knex.select('*').from('MapReferences').whereRaw('MapReferences.wayPointName IS NOT NULL').andWhereNot('MapReferences.wayPointName', '').as('wayPoints');
        // const measurementsJoinWayPoints = this.knex.select('FK_Trip', 'MeasurementId', 'FK_Trip', 'wayPointName').distinctOn('FK_Trip').from('Measurements').join(wayPoints, function() {
        //     this.on('MeasurementId', '=', 'FK_MeasurementId')
        // }).orderBy('FK_Trip', 'asc').as('measurementsJoinWayPoints');

        // //Alt kombineret med consts
        // return await this.knex.select('Trips.*', 'wayPointName').from('Trips').join(measurementsJoinWayPoints, function() {
        //     this.on('TripId', '=', 'FK_Trip')
        // });

        // //Forsøg på at merge measurementsWith og wayPoints
        // return await this.knex.select('FK_Trip', 'MeasurementId', 'FK_Trip', 'wayPointName').distinctOn('FK_Trip').from('Measurements').join((knex) => {(knex.select('*').from('MapReferences').whereRaw('MapReferences.wayPointName IS NOT NULL').andWhereNot('MapReferences.wayPointName', ''))}, function() {
        //     this.on('MeasurementId', '=', 'FK_MeasurementId')
        // }).orderBy('FK_Trip', 'asc');

        // //Følgende svarer til "measurementsWith" delen
        // return await this.knex.select('FK_Trip', 'MeasurementId', 'FK_Trip', 'wayPointName').distinctOn('FK_Trip').from('Measurements').join('MapReferences', function() {
        //     this.on('MeasurementId', '=', 'FK_MeasurementId')
        // }).orderBy('FK_Trip', 'asc');
        






        // return await this.knex.with('waypoints', (knex) => {(knex.select('*').from('public.MapReferences').whereRaw('wayPointName IS NOT NULL').andWhereRaw("wayPointName IS NOT NULL"))}).with('measurementsWith', (knex) => {(knex.select('FK_Trip', 'MeasurementId', 'FK_Trip', 'wayPointName').distinctOn('FK_Trip'))})
        // return await this.knex().with(`waypoints`, (knex) => { (knex.select(`*`, ).from(`public . MapReferences`).whereRaw("wayPointName IS NOT NULL").andWhereRaw("wayPointName IS NOT NULL")) }), `measurementswith`, (knex) => { (knex.select(knex.raw(`DISTINCT ON(FK_Trip) MeasurementId`),`FK_Trip`, `wayPointName`, ).from(`public . Measurements`).innerJoin(`waypoints`, function() { this.on("MeasurementId","=","FK_MeasurementId")}).orderByRaw(`FK_Trip ASC`)) }).select(`Trips.*`, `wayPointName`, ).from(`public . Trips`).innerJoin(`measurementswith`, function() { this.on("TripId","=","FK_Trip")})
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

            // .select( '*' )
            // .from( { public: 'Trips' } )
            // .whereNot( 'TaskId', 0 )
            // .orderBy('TaskId')

            // .raw('with wayPoints AS (SELECT * FROM public."MapReferences" WHERE "wayPointName" IS NOT NULL AND "wayPointName" != \'\'), measurementsWith AS (SELECT DISTINCT ON ("FK_Trip") "MeasurementId","FK_Trip", "wayPointName"FROM public."Measurements" JOIN wayPoints ON "MeasurementId" = "FK_MeasurementId"ORDER BY "FK_Trip" ASC) SELECT "Trips".*, "wayPointName" FROM public."Trips" JOIN measurementsWith ON "TripId" = "FK_Trip"')

            /*
            with wayPoints AS (
                SELECT * FROM public."MapReferences" 
                WHERE "wayPointName" IS NOT NULL AND "wayPointName" != ''
            ), measurementsWith AS (
                SELECT DISTINCT ON ("FK_Trip") "MeasurementId","FK_Trip", "wayPointName"
                FROM public."Measurements" JOIN wayPoints ON "MeasurementId" = "FK_MeasurementId"
                ORDER BY "FK_Trip" ASC
            )

            SELECT "Trips".*, "wayPointName" FROM public."Trips" JOIN measurementsWith ON "TripId" = "FK_Trip"
            */ 
            // .with('wayPoints', (knex) => {()})

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
