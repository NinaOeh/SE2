// extended by Nina Oehlckers (s213535)
import { MapBounds } from "../models/map"
import { Condition, WaysConditions } from "../models/path"
import { asyncPost, post, download } from "./fetch"


export const getWaysConditions = (type: string, zoom: number, setWays: (data: WaysConditions) => void) => {

    console.log("hello");
    post('/conditions/ways', { type, zoom }, setWays)

}

export const getConditions = (wayId: string, type: string, setConditions: (data: Condition[]) => void) => {
    console.log("/ways: the type is: ", type);
    console.log("/ways: the wayId is: ", wayId);
    console.log("/ways: the conditions are: ", setConditions);

    post('/conditions/way', { wayId, type }, setConditions)
}

export const getBoundedWaysConditions = async (bounds: MapBounds, type: string, zoom: number) => {
    console.log("/bounded/ways: The Bounds are: ", bounds);
    console.log("/bounded/ways: The Type is: ", type);
    return await asyncPost<WaysConditions>('/conditions/bounded/ways', { ...bounds, type, zoom })
}

//Nina Oehlckers (s213535)
export const downloadCondition = async ( maxlat: number, minlat:number, maxlon:number,minlon:number, type:string) => {
    const data = await download( '/conditions/download', maxlat,minlat,maxlon,minlon,type)
    console.log("hello download")
    return data
}
