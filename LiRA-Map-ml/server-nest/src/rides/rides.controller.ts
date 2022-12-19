//Extended  by: Nina Oehlckers (s213535) -> Download function
import { Controller, Get, Query } from '@nestjs/common';
import { RidesService } from './rides.service';

import { RideMeta } from './models.rides';
import { BoundedPath } from 'src/models';

@Controller('rides')
export class RidesController 
{

    constructor(private readonly service: RidesService) {}

    @Get()
    getRides(): Promise<RideMeta[]> {
        return this.service.getRides();
    }

    @Get('/ride')
    getRide( @Query() query: { tripId: string, dbName: string } ): Promise<BoundedPath> {
        const { tripId, dbName } = query
        return this.service.getRide( tripId, dbName );
    }

    @Get('/ride_download')
    getRideDownload( @Query() query: { tripId: string, dbName: string } ): Promise<any> {
        const { tripId, dbName } = query
        return this.service.getRidesDownload( tripId, dbName );
    }
}
