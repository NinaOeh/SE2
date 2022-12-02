/* Created by Colin Hoffmann (s212711) */
/* Eliot Ullmo */
import { ConsoleLogger, Controller, Get, Query } from '@nestjs/common';
import { FrictionService } from './f.service';
import { FrictionConditions, FrictionMeta } from './f.models';
import { Condition, WaysConditions } from 'src/models';


@Controller('friction')
export class FrictionController {
    constructor(private readonly service: FrictionService) { }

  
    @Get('ways')
    getFrictionConditions(): Promise<WaysConditions> {
        console.log('we are in the friction controller')

        return this.service.getWaysConditions();
    }

    //@Get("\con")
    //getFrictionConditions(): Promise<FrictionConditions> {
    //    console.log('Connection to friction database')

    //    return this.service.getFrictionConditions();
    //}
    @Get('way')
    getWayConditions( @Query() query: { wayId: string } ): Promise<Condition[]> {
        const { wayId } = query;
        return this.service.getWayFrictionConditions(wayId);
    }

}