import DropdownButton from 'react-bootstrap/DropdownButton'
import Dropdown from 'react-bootstrap/Dropdown'
import {useState, useEffect} from "react"
import {getRoles, addRole, deleteRole} from "../../queries/roles"
import {Role} from "../../models/roles"
import 'bootstrap/dist/css/bootstrap.min.css'

function RoleDropDown(){
    const [roles, setRoles] = useState<Role[]>([])
    const [chosenRole, ChosenRole] = useState<Role>()

    useEffect( () => getRoles(setRoles), [] );

    console.log("The roles are: ", roles)
    
    function handleSelectRole (e: any) {
        ChosenRole(e);
      };
    return (
        <DropdownButton
            title="Choose from Roles"
            id="dropdown-menu-align-right"
            onSelect={handleSelectRole}>
          {roles.map(
            role => 
                {
                    return <Dropdown.Item actionKey={role}>{role}</Dropdown.Item>;
                }
            )
          }
        </DropdownButton>
      );
}

export default RoleDropDown;