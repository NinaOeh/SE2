import { Injectable } from '@nestjs/common';
import { FrictionMeta } from './f.models';
import { InjectConnection, Knex } from 'nestjs-knex';

@Injectable()
export class FrictionService {

    constructor(@InjectConnection('FrictionDB') private readonly knex: Knex) { }

    async getFriction(): Promise<FrictionMeta[]> {
        return await

            this.knex
                .from('Friction')
                .select('lat', 'lot', 'friction_value')

    }

}