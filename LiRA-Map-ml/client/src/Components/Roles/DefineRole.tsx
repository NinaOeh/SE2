import '../../css/login.css';
import {Role} from '../../models/roles'
import Dropdown from 'react-bootstrap/Dropdown'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min';
import {UseRoleContext} from "../../context/RolesContext"
import {FC, useState} from "react"


const SelectRole : FC = ( ) => { 
    const { roles, selectedRole, setSelectedRole } = UseRoleContext()
    const [roleChosen, setRoleChosen] = useState<boolean>(false);
    
    const handleChange = (event : any) => {
        event.preventDefault();
        const { name, value } = event.target;
        setSelectedRole(prevState => ({
            ...prevState,
            [name]: value,
        }))
        setRoleChosen(true)
    }

    const newRole = () => {
        console.log("The roles are: ", roles)
    }

    console.log("roles: ", roles)

    function handleSelectRole (e: any) {
        console.log("The selection is: ", e)
        setSelectedRole(e);
        setRoleChosen(true)
      };

    return (
        <div className='signup-wrapper'>
            {roleChosen
            ? <h2>Selected Role: {selectedRole} </h2>
            : <h2>Choose Role</h2>}
            <p/>
            <div>
                <Dropdown
                    className="d-inline mx-2"
                    onSelect={handleSelectRole}
                    autoClose = {true}
                    > 

                    <Dropdown.Toggle 
                        id="dropdown-button-dark-example1" 
                        variant="secondary">
                    Show Saved Roles
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                    {roles.map(
                        (role: Role, i: number)  => 
                            {
                                console.log("role: ", role)
                                console.log(role["role"])
                                return <Dropdown.Item key={`roleId-${i}`} eventKey={role["role"]}>{role["role"]}</Dropdown.Item>;
                            }
                        )
                    }
                    </Dropdown.Menu>                     
                </Dropdown>
                <div className='signup-input-container'>
                    <label htmlFor="username">Rolename</label>
                    <input type='text' name='username' onChange={handleChange} />
                </div>
                <div className='btn signup-btn' onClick={newRole}>Add Role</div>
            </div>
        </div>
    )
}

export default SelectRole