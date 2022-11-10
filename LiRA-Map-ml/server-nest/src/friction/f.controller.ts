import { Controller } from '@nestjs/common';
import { FrictionService } from './f.service';


@Controller('friction')
export class RidesController {
    constructor(private readonly service: FrictionService) { }



}