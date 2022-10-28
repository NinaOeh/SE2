import { get, put } from "./fetch";
import { Dispatch, SetStateAction } from "react"
import { Role } from "../models/roles"


export const getRoles = ( callback: Dispatch<SetStateAction<Role[]>> ) => {
    console.log("We got here")
    const res = fetch("/roles");
    get( '/roles', callback )
}

export const addRole = (role: string) => {
	put('/roles/add', {role})	
}

export const deleteRole = (role: string) => {
	put('/roles/delete', { role } )	
}