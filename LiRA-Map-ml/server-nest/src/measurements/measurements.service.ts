
import { Injectable } from '@nestjs/common';
import { write } from 'fs';
import { readFile, writeFile } from 'fs/promises';
import { Measurement } from 'src/models';

@Injectable()
export class MeasurementsService 
{
    path: string;

    constructor() {
        this.path = './src/measurements/measurements.json'
    }

    async writeFile( data: any ) 
    {
        return await writeFile(this.path, JSON.stringify(data, null, 4), 'utf8');
    }

    async getMeasurements()
    {
        const file = await readFile(this.path, 'utf-8')
        return JSON.parse(file);
    }


    async addMeasurement(measurement: Measurement) 
    {
        const measurements = await this.getMeasurements() 
        const updatedFile = [...measurements, measurement]
        this.writeFile(updatedFile)
        const file = await readFile(this.path, 'utf-8')
        return JSON.parse(file);
    }

    async editMeasurement(index: number, measurement: Measurement) 
    {
        const measurements = await this.getMeasurements() 
        const updatedFile = [...measurements]
        updatedFile[index] = measurement
        return await this.writeFile(updatedFile);
    }
    //... adds an extra element to the list without removing any other element
    async deleteMeasurement(index: number) 
    {
        const measurements = await this.getMeasurements() 
        const updatedFile = [...measurements]
        updatedFile[index] = ""
        return await this.writeFile(updatedFile);
    }

    getHello(i: any): string {
        return (i);
      }
}
