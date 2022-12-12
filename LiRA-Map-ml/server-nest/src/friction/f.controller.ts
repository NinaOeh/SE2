/* Created by Colin Hoffmann (s212711) */
/* Eliot Ullmo */
//extended by Nina Oehlckers (s213535)
import { ConsoleLogger, Controller, Get, Query } from '@nestjs/common';
import { FrictionService } from './f.service';
import { FrictionConditions, FrictionMeta } from './f.models';
import { Condition, WaysConditions } from 'src/models';


@Controller('friction')
export class FrictionController {
    constructor(private readonly service: FrictionService) { }

  
    @Get('ways')
    getFrictionConditions(@Query() query:{geometry:boolean}): Promise<WaysConditions> {
        console.log('we are in the friction controller')
        const { geometry } = query;


        return this.service.getWaysConditions(geometry);
    }

    //@Get("\con")
    //getFrictionConditions(): Promise<FrictionConditions> {
    //    console.log('Connection to friction database')

    //    return this.service.getFrictionConditions();
    //}
    @Get('way')
    getWayConditions( @Query() query: { wayId: string } ): Promise<Condition[]> {
        const { wayId } = query;
        console.log("HELLO WE ARE HERE")
        return this.service.getWayFrictionConditions(wayId);
    }

    //Nina Oehlckers (s213535)
    @Get('friction_download')
    FrictionDownload( @Query() query: { maxlat: number, minlat:number, maxlon:number,  minlon:number} ): Promise<any> {
        console.log("The query parameters are (if we even get here)")
        console.log(query)
        console.log("We want to download friction")
        return this.service.FrictionDownload(query.maxlat,query.minlat,query.maxlon,query.minlon);
    }

}