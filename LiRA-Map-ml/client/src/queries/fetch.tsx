
import axios, { AxiosResponse } from 'axios'

const development = !process.env.NODE_ENV || process.env.NODE_ENV === 'development'

const devURL = 'http://localhost:3002' 
const prodURL = 'http://se2-A.compute.dtu.dk:3002'
const VMURL = 'http://se2-A.compute.dtu.dk:3002'

const getPath = (p: string) => ( development ? devURL : prodURL ) + p
const getMPath = (p: string) => ( development ? devURL : VMURL ) + p

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
        .then(res => res.json())
        .then(data => callback(data));
}

export function getRoleMeas<T>(path: string, role: string, callback: (data: T) => void): void 
{
    path = path + "/"+role
    fetch(getMPath(path))
        .then(res => res.json())
        .then(data => callback(data));
}

export function getR<T>(path: string, callback: (data: T) => void): void 
{   
    console.log(getMPath(path))
    fetch(getMPath(path))
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
