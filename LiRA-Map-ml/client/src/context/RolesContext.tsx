// created by Nina (s213535)
import {
	createContext,
	Dispatch,
	SetStateAction,
	useContext,
	useEffect,
	useState,
} from "react";

import { Role } from "../models/roles";
import {getRoles} from "../queries/roles"

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

    // fetch the saved roles
    useEffect( () => getRoles(setRoles), [] );
	useEffect(() => {
		const data = window.localStorage.getItem('Role');
		if ( data !== null ) setSelectedRole(JSON.parse(data));
	  }, []);

	// save the role also on browser reload
	useEffect( () => window.localStorage.setItem('Role', JSON.stringify(selectedRole)), [selectedRole])

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