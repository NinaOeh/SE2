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

interface RoleProps{
    roles: Role[];
    selectedRole: Role;
    setSelectedRole: Dispatch<SetStateAction<Role>>;

}

const RolesContext = createContext({} as RoleProps);

export const RolesProvider = ({ children }: any) => {

	const [ roles, setRoles ] = useState<Role[]>([]);
    const [ selectedRole, setSelectedRole ] = useState<Role>({
        role : "",
    });

    // fetch the saved roles
    useEffect( () => getRoles(setRoles), [] );

	console.log("We are in RolesContext and the selectedRole is: ", selectedRole)

	return (
		<RolesContext.Provider
			value={{
				roles,
				selectedRole,
				setSelectedRole,
			}}
		>
			{children}
		</RolesContext.Provider>
	);
};

export const UseRoleContext = () => useContext(RolesContext);