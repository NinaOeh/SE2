import { Dispatch, SetStateAction } from "react"
import { RideMeta } from "../models/models"
import { BoundedPath, Metadata } from "../models/path"
import { PopupFunc } from "../models/popup"
import { ActiveMeasProperties } from "../models/properties"
import { asyncPost, get, post } from "./fetch"

//implement more error catching here!

export const getRides = ( callback: Dispatch<SetStateAction<RideMeta[]>> ) => {
    get( '/rides', callback )
}

export const getRide = async (
    measurement: ActiveMeasProperties, 
    meta: Metadata, 
    popup: PopupFunc,
) => {
    const { dbName, name, hasValue } = measurement
    const { TripId: tripId, TaskId: taskId } = meta;

    console.log("We got here")

    console.log('Querying measurement: ', name, '\nTaskId: ', taskId );
    
    const { data } = await asyncPost<BoundedPath>( '/rides/ride', { tripId, dbName } )         
        
    const { path } = data;

    console.log("Got data for ride: ", taskId, "\nLength: ", path.length, '\nMeasurement: ', name, '\nHasValue?: ', hasValue ); 

    if ( path.length === 0 )
    {
        console.log("Here now1"); 

        popup( {
            icon: "warning",
            title: `This trip doesn't contain data for ${name}`,
            footer: `TripId: ${tripId} | TaskId: ${taskId}`,
            toast: true
        } );

        return undefined;
    }

    //if (path.includes(undefined)):



    console.log("Here now2", data);         
    return data;
}