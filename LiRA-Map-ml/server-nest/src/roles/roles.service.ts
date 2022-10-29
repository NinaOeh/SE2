/*Author: Nina Oehlckers (s213535)*/
import { Injectable } from '@nestjs/common';
import { write } from 'fs';
import { readFile, writeFile } from 'fs/promises';
import { Role } from 'src/models';


@Injectable()
export class RolesService 
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

    async getallRoles() : Promise<Role[]>
    {
        const file = await readFile(this.path, 'utf-8')
        const allMeasurements = JSON.parse(file)
        const allRoles = Object.keys(allMeasurements[0])
        return allRoles.map(r => {return <Role> {role: r}});
    }

    async addRole(role: string) 
    {
        var measurements = await this.getallMeasurements()
        measurements[0][role] = []
        return await this.writeFile(measurements)
    }

    async deleteRole(role: string) 
    {
        var measurements = await this.getallMeasurements() 
        console.log(measurements)
        delete measurements[0][role]
        console.log(measurements)
        return await this.writeFile(measurements);
    }
}