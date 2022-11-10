/* Created by Colin Hoffmann (s212711) */

import { ConsoleLogger, Controller, Get } from '@nestjs/common';
import { FrictionService } from './f.service';
import { FrictionMeta } from './f.models';


@Controller('friction')
export class FrictionController {
    constructor(private readonly service: FrictionService) { }

    @Get()
    getFriction(): Promise<FrictionMeta[]> {
        console.log('Connection to friction database')
        return this.service.getFriction()
    }

}