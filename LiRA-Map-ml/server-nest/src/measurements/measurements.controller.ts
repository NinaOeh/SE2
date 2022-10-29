/**Modifications authored by: Nina Oehlckers (s213535) */
/**This is overall not ideal! It would be a lot better to save
these measurements in their own database, that I could add to/
delete from etc, instead of just accessing this one document.*/
import { Controller, Get, Put, Query, Body, Param} from '@nestjs/common';
import { Measurement } from 'src/models';
import { MeasurementsService } from './measurements.service';

@Controller('measurements')
export class MeasurementsController 
{
    constructor(private readonly service: MeasurementsService) {}
    
    @Get(':role')
    getMeasurements(@Param() params): Promise<Measurement[]> 
    {
        return this.service.getMeasurements(params.role);
    }

    @Get("/test")
    test(@Query() query: { input: string }): string //: Promise<any>  @Query() query: { input: string } 
    {
            return this.service.getHello(query.input);
        //return this.service.addMeasurement(measurement);
    }

    @Put('/add')
    addMeasurement( @Body() query: {measurement: Measurement, role: string}) : Promise<any> 
    {
        const { measurement, role } = query["params"];
        return this.service.addMeasurement(measurement, role);
    }

    @Put('/edit')
    editMeasurement( @Body() query: { index: number, measurement: Measurement, role: string } ): Promise<any> 
    {   
        console.log("query ", query)
        const { index, measurement, role } = query["params"];
        return this.service.editMeasurement(index, measurement, role);
    }
    @Put('/delete')
    deleteMeasurement( @Body() query: { index: number, role: string } ): Promise<any> 
    {
        const { index, role } = query["params"];
        return this.service.deleteMeasurement(index, role);
    }
}
