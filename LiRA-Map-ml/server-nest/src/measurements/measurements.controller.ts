import { Controller, Get, Put, Query } from '@nestjs/common';
import { Measurement } from 'src/models';

import { MeasurementsService } from './measurements.service';

/**This is overall not ideal! It would be a lot better to save
these measurements in their own database, that I could add to/
delete from etc, instead of just accessing this one document.*/

@Controller('measurements')
export class MeasurementsController 
{
    constructor(private readonly service: MeasurementsService) {}
    
    @Get()
    getMeasurements(): Promise<Measurement[]> 
    {
        return this.service.getMeasurements();
    }

    @Get("/test")
    test(@Query() query: { input: string }): string //: Promise<any>  @Query() query: { input: string } 
    {
            return this.service.getHello(query.input);
        //return this.service.addMeasurement(measurement);
    }

    @Put('/add')
    addtMeasurement( @Query() query: { measurement: Measurement } ) //: Promise<any> 
    {
        const { measurement } = query
        return this.service.addMeasurement(measurement);
    }

    @Put('/edit')
    editMeasurement( @Query() query: { index: number, measurement: Measurement } ): Promise<any> 
    {
        const { index, measurement } = query;
        return this.service.editMeasurement(index, measurement);
    }
    @Put('/delete')
    deleteMeasurement( @Query() query: { index: number } ): Promise<any> 
    {
        const { index } = query;
        return this.service.deleteMeasurement(index);
    }
}
