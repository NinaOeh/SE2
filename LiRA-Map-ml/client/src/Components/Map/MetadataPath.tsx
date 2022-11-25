
import { useEffect } from "react";
import { FC, useState } from "react";

import { CircleMarker, Marker, Popup } from "react-leaflet";
import { DotHover } from "../../assets/graph/types";
import { PathProps } from "../../models/path";
import Path from "./Path";
import { GraphProvider, useGraph } from "../../context/GraphContext";


const parseMD = (mds: any) => {
    
    if ( typeof mds === 'object' && Array.isArray(mds) )
    {
        return <div key={`md-${Math.random()}`}>{mds.map(md => parseMD(md)).join(', ')}</div>
    }
    else if ( typeof mds === 'object' )
    {
        return Object.keys(mds).map(k => 
            <div key={`md-${Math.random()}`}> {' > '} {k}: {parseMD(mds[k])}</div>
        )
    }

    return mds
}

const getPopupLine = (key: string, value: any) => {
    if ( value === undefined || value === null )
        return null;

    else if ( typeof value === 'object' )
        return <div key={`popupline-${Math.random()}`}>{key}:{parseMD(value)}</div>
    
    return <div key={`popupline-${Math.random()}`}>{key}: {value}</div>
}

const MetadataPath: FC<PathProps> = ( { path, properties, metadata } ) => {

    const [markerPos, setMarkerPos] = useState<[number, number]>([0, 0]);
    const [selected, setSelected] = useState<number | undefined>(undefined);
    // const [ dotHover, setDotHover ] = useState<DotHover>();
    
    

    const graphProvider = useGraph();

    const onClick = (i: number) => (e: any) => {
        const { lat, lng } = e.latlng
        setMarkerPos([lat, lng])
        setSelected(i)
    }
    
    const point = path[selected || 0]
    const md = metadata || {}
    return ( <> 
        <Path path={path} properties={properties} onClick={onClick}></Path>
        
        { selected !== undefined && 
            <Marker position={markerPos}>
                <Popup>
                    { getPopupLine('Properties', properties) }
                    { getPopupLine('Value', point.value) }
                    { Object.keys(point.metadata || {}).map(key => getPopupLine(key, point.metadata[key]))}
                    { Object.keys(md).map(key => getPopupLine(key, md[key]))}
                </Popup>
            </Marker> 
        }
        { graphProvider.dotHover !== undefined && 
            <Marker position={[graphProvider.dotHover.lat,graphProvider.dotHover.lng]}></Marker>
        }
    </> )
}

export default MetadataPath;
