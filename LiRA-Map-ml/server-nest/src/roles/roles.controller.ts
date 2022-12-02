/*Author: Nina Oehlckers (s213535)*/

/**This is overall not ideal! It would be a lot better to save
these roles in their own database, connected to the measurements, that we could add to/
delete from etc, instead of just accessing this one document.*/
import { Controller, Get, Put, Query, Body, Param} from '@nestjs/common';
import { Role } from 'src/models';
import { RolesService } from './roles.service';

@Controller('roles')
export class RolesController 
{
    constructor(private readonly service: RolesService) {}
    
    @Get()
    getRoles(): Promise<Role[]> 
    {
        return this.service.getallRoles();
    }

    @Put('/add')
    addRole( @Body() query: {role: string}) : Promise<any> 
    {
        const { role } = query["params"];
        return this.service.addRole(role);
    }

    @Put('/delete')
    deleteRole( @Body() query: { role: string } ): Promise<any> 
    {
        const { role } = query["params"];
        return this.service.deleteRole(role);
    }
}
