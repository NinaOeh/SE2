
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
        console.log("allRoles1: ",file)
        const allMeasurements = JSON.parse(file)
        console.log("allRoles2: ",allMeasurements)
        const allRoles = Object.keys(allMeasurements[0])
        console.log("allRoles3: ",allRoles)
        return allRoles.map(r => {return <Role> {role: r}});
    }

    async addRole(role: string) 
    {
        var Role = role+"[]"
        var measurements = await this.getallMeasurements() 
        const new_measurements = [...measurements, Role]
        return await this.writeFile(new_measurements)
    }

    async deleteRole(role: string) 
    {
        var measurements = await this.getallMeasurements() 
        delete measurements[role]
        return await this.writeFile(measurements);
    }
}