import { Controller, Get, Put, Query, Body, Param} from '@nestjs/common';
import { Role } from 'src/models';

import { RolesService } from './roles.service';

/**This is overall not ideal! It would be a lot better to save
these measurements in their own database, that I could add to/
delete from etc, instead of just accessing this one document.*/

@Controller('roles')
export class RolesController 
{
    constructor(private readonly service: RolesService) {}
    
    @Get()
    getRoles(): Promise<Role[]> 
    {
        console.log("We are here in the server, wuhu")
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
