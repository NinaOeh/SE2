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

	console.log("RolesProvider1")

	const [ roles, setRoles ] = useState<Role[]>([]);
    const [ selectedRole, setSelectedRole ] = useState<Role>({
        role : "",
    });
	console.log("RolesProvider2")

    // fetch the metadata of all the rides
    useEffect( () => getRoles(setRoles), [] );

	console.log("RolesProvider3")

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