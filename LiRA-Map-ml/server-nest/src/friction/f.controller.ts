import { Controller } from '@nestjs/common';
import { FrictionService } from './f.service';


@Controller('friction')
export class FrictionController {
    constructor(private readonly service: FrictionService) { }



}