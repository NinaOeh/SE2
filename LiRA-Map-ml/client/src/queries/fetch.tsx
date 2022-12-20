// modified and extended by Nina Oehlckers (s213535)
import axios, { AxiosResponse } from 'axios'

const development = !process.env.NODE_ENV || process.env.NODE_ENV === 'development'

const devURL = 'http://se2-A.compute.dtu.dk:3002'
const prodURL = 'http://se2-A.compute.dtu.dk:3002'

const getPath = (p: string) => ( development ? devURL : prodURL ) + p

export async function asyncPost<T>(path: string, obj: object ): Promise<AxiosResponse<T, any>>
{
    return axios.get<T>( getPath(path), {
        params: obj,
        paramsSerializer: params => Object.keys(params)
            .map( (key: any) => new URLSearchParams(`${key}=${params[key]}`) )
            .join("&")
    } )
}

export function get<T>(path: string, callback: (data: T) => void): void 

{
    console.log("developpement:",development);
    fetch(getPath(path))
    .then(res=>res.json())
    .then(data => callback(data));
}

export function getFriction<T>(path: string, callback: (data: T) => void): void 
{   

    const p=prodURL +path
    fetch(p)
    .then(res => res.json())
    .then(data => callback(data));

}

export function getFrict<T>(path: string, obj: object, callback: (data: T) => void): void 
{
    const p=prodURL +path
    fetch(p)
    .then(res=>res.json())
    .then(data=>callback(data));
}


//Nina Oehlckers (s213535)
export function getRoleMeas<T>(path: string, role: string, callback: (data: T) => void): void 
{
    path = path + "/"+role
    fetch(getPath(path))
        .then(res => res.json())
        .then(data => callback(data));
}
//Nina Oehlckers (s213535)
export function getR<T>(path: string, callback: (data: T) => void): void 
{   
    console.log(getPath(path))
    fetch(getPath(path))
        .then(res => res.json())
        .then(data => callback(data));
}

export function post<T>(path: string, obj: object, callback: (data: T) => void): void
{
    asyncPost<T>(path, obj).then(res => callback(res.data));
}

export const put = ( path: string, obj: object ): void => {
    axios.put( getPath(path), { params: obj } )
}  

//Nina Oehlckers (s213535)
export async function download<T>(path: string, maxlat: number, minlat: number, maxlon: number, minlon: number, type:string)
{   
    path = path+`?maxlat=${maxlat}&maxlon=${maxlon}&minlon=${minlon}&minlat=${minlat}&type=${type}`
    console.log(getPath(path))
    const response = await fetch(getPath(path))
    const data = await response.json();
    console.log(data)
    return data
}
//Nina Oehlckers (s213535)
export async function friction_download<T>(path: string, maxlat: number, minlat: number, maxlon: number, minlon: number)
{   
    path = path+`?maxlat=${maxlat}&maxlon=${maxlon}&minlon=${minlon}&minlat=${minlat}`
    console.log(getPath(path))
    const response = await fetch(getPath(path))
    const data = await response.json();
    console.log(data)
    return data
}

//Nina Oehlckers (s213535)
export async function ride_download<T>(path: string, tripId: string, dbName: string)
{   
    path = path+`?tripId=${tripId}&dbName=${dbName}`
    console.log(getPath(path))
    const response = await fetch(getPath(path))
    const data = await response.json();
    console.log(data)
    return data
}