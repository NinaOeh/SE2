import { MeasProperties, ActiveMeasProperties } from "../models/properties";
import { getRoleMeas, put } from "./fetch";


export const getMeasurements = ( role: string, callback: React.Dispatch<React.SetStateAction<ActiveMeasProperties[]>> ) => {
    getRoleMeas('/measurements', role, (data: MeasProperties[]) => {
        console.log("the role is: ", role)
        console.log("the collected measurements: ",data);
        callback( data.map( meas => { 
            return { ...meas, isActive: false } 
        } ) )
    })
}

export const addMeasurement = (measurement: MeasProperties, role: string) => {
	put('/measurements/add', {measurement, role})	
}

export const editMeasurement = (measurement: MeasProperties, index: number, role: string) => {
    console.log("edit measurement")
	put('/measurements/edit', { measurement, index, role } )	
}

export const deleteMeasurement = (index: number, role: string) => {
	put('/measurements/delete', { index, role } )	
}