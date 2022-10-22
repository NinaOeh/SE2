
import { Injectable } from '@nestjs/common';
import { write } from 'fs';
import { readFile, writeFile } from 'fs/promises';
import { Measurement } from 'src/models';

@Injectable()
export class MeasurementsService 
{
    path: string;

    constructor() {
        this.path = './data/measurements.json'
    }

    async writeFile( data: any ) 
    {
        return await writeFile(this.path, JSON.stringify(data, null, 4), 'utf8');
    }

    async getallMeasurements()
    {
        const file = await readFile(this.path, 'utf-8')
        return JSON.parse(file);
    }

    async getMeasurements(role: string)
    {
        const file = await readFile(this.path, 'utf-8')
        //console.log(role)
        //console.log("json parse log1", JSON.parse(file))
        //console.log("json parse log", JSON.parse(file)[0][role])
        return JSON.parse(file)[0][role];
    }


    async addMeasurement(measurement: Measurement, role: string) 
    {
        var measurements = await this.getallMeasurements() 
        const role_measurements = [...measurements[0][role], measurement]
        measurements[0][role] = role_measurements
        return await this.writeFile(measurements)
    }

    async editMeasurement(index: number, measurement: Measurement, role: string) 
    {
        var measurements = await this.getallMeasurements()
        measurements[0][role][index] = measurement
        return await this.writeFile(measurements);
    }
    //... adds an extra element to the list without removing any other element
    async deleteMeasurement(index: number, role: string) 
    {
        var measurements = await this.getallMeasurements() 
        measurements[0][role].splice(index,1)
        return await this.writeFile(measurements);
    }

    getHello(i: any): string {
        return (i);
      }
}

