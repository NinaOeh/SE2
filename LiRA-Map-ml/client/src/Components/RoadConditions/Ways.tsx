
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

interface IWays {
    palette: TRGB[]
    type: string;
    onClick?: (way_id: string, way_length: number) => void;
}

const Ways: FC<IWays> = ( { palette, type, onClick } ) => {
    const zoom = useZoom();
    const { minY, maxY,filter,friction } = useGraph()

    const [ways, setWays] = useState<WaysConditions>()

    const stateRef = useRef(0);


    

 
    

    const options = useMemo<HotlineOptions>( () => ({
        palette, min: minY, max: maxY
    } ), [palette, minY, maxY,] )

    
    const handlers = useMemo<HotlineEventHandlers>( () => ({
        click: (_,  i) => {
            const max = ways? ways.conditions[i].reduce((prev, current) => (prev.value > current.value) ? prev : current).value :0;

          
            console.log("im here:",filter);
            if ( ways && onClick )
                if(max>filter){ 
               
                    onClick(ways.way_ids[i], ways.way_lengths[i])
                }

                
        },
        
        mouseover:(e,i,p)=>{
            if(ways){
                const max = ways.conditions[i].reduce((prev, current) => (prev.value > current.value) ? prev : current).value
                if(max<filter){
                    p.setStyle({opacity: 0,color:"#e6e"})
                    
                }

            }

        }
        
        ,
     


    }), [ways,filter] ) 

    useEffect( () => {
        if ( zoom === undefined ) return;
        const z = Math.max(0, zoom - 12)

        if(friction){

            console.log("i am trying to get data from friction")


            
            getFrictionConditions((data:WaysConditions)=>{
                console.log("data that i receive:",data);
                setWays( data );


            })
                
        }
        else{
            getWaysConditions(type, z, (data: WaysConditions) => {
                setWays( data );
                stateRef.current = 10000;

            } )
    }

    }, [zoom,friction] )

    
    

    useEffect(()=>{
        if(ways){
            console.log("geometry",ways.geometry);

           
        }
    }
    ,[filter])
 

  
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

export default Ways;