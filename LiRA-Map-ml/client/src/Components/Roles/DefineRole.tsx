import '../../css/login.css';
import {Role} from '../../models/roles'
import Dropdown from 'react-bootstrap/Dropdown'
import Button from 'react-bootstrap/Button'
//import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min';
import {UseRoleContext} from "../../context/RolesContext"
import {FC, useState} from "react"
import {addRole, deleteRole} from "../../queries/roles"

import createPopup from '../createPopup';

function UpdateRoles(){
    var{roles} = UseRoleContext()
    return roles
}

const SelectRole : FC = ( ) => { 
    var {roles, selectedRole, setSelectedRole } = UseRoleContext()
    const [roleChosen, setRoleChosen] = useState<boolean>(false);
    

    const [newUserName, setNewUserName] = useState<Role>({
        role : "",
    });

    const handleChange = (event : any) => {
        event.preventDefault();
        const { name, value } = event.target;
        setNewUserName(prevState => ({
            ...prevState,
            [name]: value,
        }))
        
    }
    const popup=createPopup();
    const newRole = () => {
        if (roles.some(function(r) { return r.role === newUserName.role})){popup( {
                icon: "warning",
                title: `This role does already exist. To create a new role please choose a different name.`,
                toast: true,
            } );
        }
        else{
            setSelectedRole(newUserName)
            setRoleChosen(true)
            addRole(newUserName.role)
            roles = UpdateRoles()
        }
    }

    const delRole = () => {
        if (roles.some(function(r) { return r.role === newUserName.role})){
            deleteRole(newUserName.role)
            roles = UpdateRoles()
        }
        else{
            popup( {
                icon: "warning",
                title: `This role does not exist. Only existing roles can be deleted`,
                toast: true,
            } );
        }
    }

    console.log("roles: ", roles)
    console.log("selectedRole: ", selectedRole)

    function handleSelectRole (e: any) {
        setSelectedRole({role:e});
        setRoleChosen(true)
      };

    return (
        <>
        <div className='signup-wrapper'>
        {roleChosen
                ? <h3>Selected role: {selectedRole.role} </h3>
                : <h3>No role selected. Please choose or add a new role.</h3>}
                <p/>
            <div className='signup-input-container'>
                <div>
                <h5> Select Role </h5>
                <label/>
                <div>
                    <Dropdown
                        className="d-inline mx-2"
                        onSelect= {handleSelectRole}
                        autoClose = {true}
                        > 
                        <Dropdown.Toggle>
                        Show Saved Roles
                        </Dropdown.Toggle>
                        <Dropdown.Menu variant="dark">
                        {roles.map(
                            (role: Role, i: number)  => 
                                {
                                    return <Dropdown.Item key={`roleId-${i}`} eventKey={role["role"]}>{role["role"]}</Dropdown.Item>;
                                }
                            )
                        }
                        </Dropdown.Menu>                     
                    </Dropdown>
                </div>   
                </div>
            <div >
                <h5> Add new role </h5>
                <label htmlFor="role">Rolename</label>
                <input type='text' name='role' onChange={handleChange} />
            <Button className='signup-btn' onClick={newRole}>Add Role</Button>
            </div>
            <div >
                <h5> Delete role </h5>
                <label htmlFor="role">Rolename</label>
                <input type='text' name='role' onChange={handleChange} />
            <Button className='signup-btn' onClick={delRole}>Delete Role</Button>
            </div>
        </div>
        </div>
     </>
    )
}

export default SelectRole