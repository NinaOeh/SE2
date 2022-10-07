import { FilProperties, ActiveFilProperties } from "../models/properties";
import { get, put } from "./fetch";


export const getMeasurements = ( callback: React.Dispatch<React.SetStateAction<ActiveFilProperties[]>> ) => {
    get('/measurements', (data: FilProperties[]) => {
        console.log(data);
        callback( data.map( meas => { 
            return { ...meas, isActive: false } 
        } ) )
    })
}

export const addMeasurement = (measurement: FilProperties) => {
	put('/measurements/add', measurement)	
}

export const editMeasurement = (measurement: FilProperties, index: number) => {
	put('/measurements/edit', { measurement, index } )	
}