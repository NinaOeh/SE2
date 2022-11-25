import { MapBounds } from "../models/map"
import { Condition, WaysConditions } from "../models/path"
import { asyncPost, post } from "./fetch"

const devURL = 'http://localhost:3002'
const prodURL = 'http://lirase2.compute.dtu.dk:3002'
const development = !process.env.NODE_ENV || process.env.NODE_ENV === 'development'

const getPath = (p: string) => ( development ? devURL : prodURL ) + p

export const getWaysConditions = ( type: string, zoom: number, setWays: (data: WaysConditions) => void ) => {

    console.log("hello");
    post( '/conditions/ways', { type, zoom }, setWays )
    
}

export const getConditions = ( wayId: string, type: string, setConditions: (data: Condition[]) => void ) => {
    console.log("/ways: the type is: ", type);
    console.log("/ways: the wayId is: ", wayId);
    console.log("/ways: the conditions are: ", setConditions);

    post( '/conditions/way', { wayId, type }, setConditions )
}

export const getBoundedWaysConditions = async ( bounds: MapBounds, type: string, zoom: number ) => {
    console.log("/bounded/ways: The Bounds are: ",bounds);
    console.log("/bounded/ways: The Type is: ",type);
    return await asyncPost<WaysConditions>( '/conditions/bounded/ways', { ...bounds, type, zoom } )
}
