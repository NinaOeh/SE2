import { Controller, Get, Query } from '@nestjs/common';

import { Condition, MapBounds, WaysConditions } from 'src/models';
import { FrictionService } from './f.service';

@Controller('friction')
export class FrictionController {
    constructor(private readonly service: FrictionService) { }

    @Get('ways')
    getWaysFriction(@Query() query: { type: string, zoom: string }): Promise<WaysConditions> {
        const { type, zoom } = query;
        return this.service.getWaysConditions(type, zoom);
    }

    @Get('way')
    getWayFriction(@Query() query: { wayId: string, type: string }): Promise<Condition[]> {
        const { wayId, type } = query;
        return this.service.getWayRoadConditions(wayId, type);
    }

    @Get('/bounded/ways')
    getBoundedWaysFriction(@Query() query: { minLat: string, maxLat: string, minLng: string, maxLng: string, type: string, zoom: string }): Promise<any> {
        const { minLat, maxLat, minLng, maxLng, type, zoom } = query;
        const bounds: MapBounds = {
            minLat: parseFloat(minLat),
            maxLat: parseFloat(maxLat),
            minLng: parseFloat(minLng),
            maxLng: parseFloat(maxLng)
        }
        return this.service.getBoundedWaysConditions(bounds, type, zoom);
    }
}