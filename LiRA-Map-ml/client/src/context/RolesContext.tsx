import {
	createContext,
	Dispatch,
	SetStateAction,
	useContext,
	useEffect,
	useState,
} from "react";

import { Role } from "../models/roles";
import {getRoles, addRole, deleteRole} from "../queries/roles"
import { createBrowserHistory } from "history";
import qs from "qs";

interface RoleProps{
    roles: Role[];
    selectedRole: Role;
    setSelectedRole: Dispatch<SetStateAction<Role>>;
	setRoles: Dispatch<SetStateAction<Role[]>>;
}

const RolesContext = createContext({} as RoleProps);

export const RolesProvider = ({ children }: any) => {

	const [ roles, setRoles ] = useState<Role[]>([]);
    const [ selectedRole, setSelectedRole ] = useState<Role>({
        role : "",
    });

	//save the role also on browser reload
	const history = createBrowserHistory();

    // fetch the saved roles
    useEffect( () => getRoles(setRoles), [] );
	useEffect(() => {
		const data = window.localStorage.getItem('Role');
		if ( data !== null ) setSelectedRole(JSON.parse(data));
	  }, []);
	useEffect( () => window.localStorage.setItem('Role', JSON.stringify(selectedRole)), [selectedRole])


	//when some things change to fetch the roles again, add some information in the squared brackets 
	// put for example roles or selectedRoles into the squared brackets

	console.log("We are in RolesContext and the selectedRole is: ", selectedRole)

	return (
		<RolesContext.Provider
			value={{
				roles,
				selectedRole,
				setSelectedRole,
				setRoles
			}}
		>
			{children}
		</RolesContext.Provider>
	);
};

export const UseRoleContext = () => useContext(RolesContext);