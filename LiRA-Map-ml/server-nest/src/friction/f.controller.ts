// Colin Hoffmann (s212711)
// Eliot Ullmo (s221646)
//extended by Nina Oehlckers (s213535)
import { Controller, Get, Query } from '@nestjs/common';
import { FrictionService } from './f.service';
import { Condition, WaysConditions } from 'src/models';

@Controller('friction')
export class FrictionController {
    constructor(private readonly service: FrictionService) { }

    @Get('ways')
    getFrictionConditions(@Query() query: { geometry: boolean }): Promise<WaysConditions> {
        console.log('we are in the friction controller')
        const { geometry } = query;

        return this.service.getWaysConditions(geometry);
    }

    @Get('way')
    getWayConditions(@Query() query: { wayId: string }): Promise<Condition[]> {
        const { wayId } = query;
        console.log("HELLO WE ARE HERE")
        return this.service.getWayFrictionConditions(wayId);
    }

    //Nina Oehlckers (s213535)
    // returns the friction data in the given boundaries
    @Get('friction_download')
    FrictionDownload(@Query() query: { maxlat: number, minlat: number, maxlon: number, minlon: number }): Promise<any> {
        return this.service.FrictionDownload(query.maxlat, query.minlat, query.maxlon, query.minlon);
    }

}