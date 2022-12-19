/*Modifications authored by: Nina Oehlckers (s213535)*/
import { Injectable } from '@nestjs/common';
import { readFile, writeFile } from 'fs/promises';
import { Measurement } from 'src/models';

@Injectable()
export class MeasurementsService 
{
    path: string;

    constructor() {
        this.path = './data/measurements.json'
    }

    // write to the measurements Json file
    async writeFile( data: any ) 
    {
        return await writeFile(this.path, JSON.stringify(data, null, 4), 'utf8');
    }

    // returns all measurements
    async getallMeasurements()
    {
        const file = await readFile(this.path, 'utf-8')
        return JSON.parse(file);
    }

    // returns all measurement for the speficied role
    async getMeasurements(role: string)
    {
        const file = await readFile(this.path, 'utf-8')
        return JSON.parse(file)[0][role];
    }

    // adds a new measurement to the specific role
    async addMeasurement(measurement: Measurement, role: string) 
    {
        var measurements = await this.getallMeasurements() 
        const role_measurements = [...measurements[0][role], measurement]
        measurements[0][role] = role_measurements
        return await this.writeFile(measurements)
    }
    // exchanges the measurement in index "index" with the passed 
    // measurement in the measurements list 
    async editMeasurement(index: number, measurement: Measurement, role: string) 
    {
        var measurements = await this.getallMeasurements()
        measurements[0][role][index] = measurement
        return await this.writeFile(measurements);
    }
    // adds an extra element to the measurements list without removing any other element
    async deleteMeasurement(index: number, role: string) 
    {
        var measurements = await this.getallMeasurements() 
        measurements[0][role].splice(index,1)
        return await this.writeFile(measurements);
    }

}

