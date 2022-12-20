//created by Nina Oehlckers (s213535)
import { put, getR } from "./fetch";
import { Dispatch, SetStateAction } from "react"
import { Role } from "../models/roles"


export const getRoles = ( callback: Dispatch<SetStateAction<Role[]>> ) => {
    getR( '/roles', callback )
}

export const addRole = (role: string) => {
	put('/roles/add', {role})	
}

export const deleteRole = (role: string) => {
	put('/roles/delete', { role } )	
}