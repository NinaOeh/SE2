
import { latLng, map } from 'Leaflet.MultiOptionsPolyline';
import { FC, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { TRGB } from 'react-gradient-hook/lib/types';
import { Tooltip } from 'react-leaflet';
import { HotlineOptions } from 'react-leaflet-hotline';
import { HotlineEventHandlers } from 'react-leaflet-hotline/lib/types';
import Swal from 'sweetalert2';
import { useGraph } from '../../context/GraphContext';
import { FilteringOptions, FrictionMeta } from '../../models/models';
import { Condition, WaysConditions } from '../../models/path';
import { getWaysConditions } from '../../queries/conditions';
import {  getFrictionConditions } from '../../queries/friction';
import createPopup from '../createPopup';
import useZoom from '../Map/Hooks/useZoom';
import DistHotline from '../Map/Renderers/DistHotline';
import FilteringSelector from './DropDown';
import {Node} from '../../models/path';

interface IWays {
    palette: TRGB[]
    type: string;
    onClick?: (way_id: string, way_length: number,f:number) => void;
}



const Ways: FC<IWays> = ( { palette, type, onClick } ) => {

    const zoom = useZoom();
    const { minY, maxY,filter,friction } = useGraph()

    const [ways, setWays] = useState<WaysConditions>()



    

 
    

    const options = useMemo<HotlineOptions>( () => ({
        palette, min: minY, max: maxY
    } ), [palette, minY, maxY,] )

    
    const handlers = useMemo<HotlineEventHandlers>( () => ({
        click: (_,  i) => {
            const max = ways? ways.conditions[i].reduce((prev, current) => (prev.value > current.value) ? prev : current).value :0;

            
            console.log("im here:",ways?.conditions[i]);
            if ( ways && onClick )
               
                    onClick(ways.way_ids[i], ways.way_lengths[i],filter)
                

                
        },
        
       
        
     


    }), [ways,filter] ) 

    useEffect( () => {
        if ( zoom === undefined ) return;
        const z = Math.max(0, zoom - 12)

        if(friction){

            console.log("i am trying to get data from friction boum")


            
            getFrictionConditions((data:WaysConditions)=>{
                console.log("data that i receive:",data);
                filterWays(data,setWays,filter)


            })
                
        }
        else{
            getWaysConditions(type, z, (data: WaysConditions) => {


                filterWays(data,setWays,filter)

               
             





            } )
    }

    }, [zoom,friction,filter] )



    
    if(ways){
        console.log("ways conditions:",ways.conditions)
        }

    
    


 

    return (
        <>
        { ways 
            ? <><DistHotline
                    way_ids={ways.way_ids}
                    geometry={ways.geometry}
                    conditions={ways.conditions}
                    options={options}
                    eventHandlers={handlers}
                    /></>

            : null 
        }
    
        </>

    )
}

function filterWays(data:WaysConditions,setWays: React.Dispatch<React.SetStateAction<WaysConditions | undefined>>, filter:number ){
    const g:Node={lat:0,lng:0,way_dist:0};
                
                const s:string[]=[]
                const l:number[]=[]
                let geo:Node[][]=[]


                for(let i=data.conditions.length-1;i>=0;i--){
                    const max=data.conditions[i].reduce((prev, current) => (prev.value > current.value) ? prev : current).value
                    if(max>filter){
                        geo.push(data.geometry[i]);
                        s.push(data.way_ids[i]);
                        l.push(data.way_lengths[i]);


                    }
                }
                data.geometry=geo;
                data.way_ids=s;
                data.way_lengths=l;

                
                data.conditions.filter(c=>{
                    const max=c.reduce((prev, current) => (prev.value > current.value) ? prev : current).value
                    return max>filter

                })
                
                
                setWays( data );
             


}



export default Ways;