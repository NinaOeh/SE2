// created by Nina Oehlckers (s213535)
import '../../css/login.css';
import {Role} from '../../models/roles'
import Dropdown from 'react-bootstrap/Dropdown'
import Button from 'react-bootstrap/Button'
import 'bootstrap/dist/js/bootstrap.bundle.min';
import {UseRoleContext} from "../../context/RolesContext"
import {FC, useState} from "react"
import {addRole, deleteRole} from "../../queries/roles"

import createPopup from '../createPopup';

const SelectRole : FC = ( ) => { 
    var {roles, setRoles, selectedRole, setSelectedRole } = UseRoleContext()
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
        }));
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
            setRoles( prev => [...prev, newUserName])
            popup( {
                icon: "info",
                title: `Role ${newUserName.role} was created.`,
                toast: true,
            } );
        }
    }

    const delRole = () => {
        if (roles.some(function(r) { return r.role === newUserName.role})){
            deleteRole(newUserName.role)
            setRoles(prev => prev.filter( el => el.role !== newUserName.role ))
            popup( {
                icon: "info",
                title: `Role ${newUserName.role} was deleted.`,
                toast: true,
            } );  
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
    
    let roletext;
    if (selectedRole.role == ""){
        <h3>No role selected. Please choose or add a new role.</h3>
    }
    else{
        roletext = <h3>Selected role: {selectedRole.role} </h3>
    }

    return (
        <>
        <div className='signup-wrapper'>
            {roletext}
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
                        <Dropdown.Toggle className='signup-btn'>
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