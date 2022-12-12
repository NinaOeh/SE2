//main: ELiot Ullmo
//minor: Nina Oehlckers

import { FC, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ChartData } from "chart.js";
import { Palette } from "react-leaflet-hotline";

import MapWrapper from "../Map/MapWrapper";
import { RENDERER_PALETTE } from "../Map/constants";
import PaletteEditor from "../Palette/PaletteEditor";
import Ways from "./Ways";

import useSize from "../../hooks/useSize";

import { ConditionType } from "../../models/graph";
import { Condition } from "../../models/path";

import { getConditions } from "../../queries/conditions";
import { useGraph } from "../../context/GraphContext";
import TypeChanger from "./Slider";
import { getFrictConditions } from "../../queries/friction";


import 'leaflet-draw/dist/leaflet.draw.css'
import { EditControl } from "react-leaflet-draw";
import { FeatureGroup } from "react-leaflet";
import React from "react";

import Downloader from './DownloadData'
import '../../css/downloader.css'


interface Props {
    type: ConditionType;

    palette: Palette;
    setPalette: React.Dispatch<React.SetStateAction<Palette>>;
    setWayData: React.Dispatch<React.SetStateAction<ChartData<"line", number[], number> | undefined>>;
}

const ConditionsMap: FC<Props> = ( { type, palette, setPalette, setWayData } ) => {

    const {filter,friction,typeCondition}=useGraph();

    
    const { name, max, grid, samples } = type;

    const ref = useRef(null);
    const [width, _] = useSize(ref)
    const c1 = { r: 70,  g: 70, b: 255, t: 0 }
    const c2 = { r: 255, g: 70, b: 70,  t: 1 } 
    useEffect(()=>{
        console.log(palette);

    },[palette]);

    const _onClick = useCallback((way_id: string, way_length: number,f:number) => {
        console.log("helloonclick")

        if(friction){

            getFrictConditions( way_id, (wc: Condition[]) => {

                const max = wc.reduce((prev, current) => (prev.value > current.value) ? prev : current).value
                console.log("maximum value:",max);
                console.log("the filter is:",f);

                    if(max>f){
                        
                            setWayData( {
                                labels: wc.map( p => p.way_dist * 1 ),
                                datasets: [ {
                                    type: 'line' as const,
                                    label: way_id,
                                    borderColor: 'rgb(160,32,240)',
                                    borderWidth: 2,
                                    fill: false,
                                    tension: 0.1,
                                    data: wc.map( p => p.value ),
                                } ]
                            } )

                        }
                        else{
                        
                            setWayData( {
                                labels: [],
                                datasets: [ {
                                    type: 'line' as const,
                                    label: "0",
                                    borderColor: 'rgb(160,32,240)',
                                    borderWidth: 2,
                                    fill: false,
                                    tension: 0.1,
                                    data: [],
                                } ]
                            } )
                    }
            }  
        )

        }
        else{
                getConditions( way_id, name, (wc: Condition[]) => {
                    const max = wc.reduce((prev, current) => (prev.value > current.value) ? prev : current).value
                    console.log("maximum value:",max);
                    console.log("the filter is:",f);

                        if(max>f){
                            
                                setWayData( {
                                    labels: wc.map( p => p.way_dist * 1 ),
                                    datasets: [ {
                                        type: 'line' as const,
                                        label: way_id,
                                        borderColor: 'rgb(160,32,240)',
                                        borderWidth: 2,
                                        fill: false,
                                        tension: 0.1,
                                        data: wc.map( p => p.value ),
                                    } ]
                                } )

                            }
                            else{
                            
                                setWayData( {
                                    labels: [],
                                    datasets: [ {
                                        type: 'line' as const,
                                        label: "0",
                                        borderColor: 'rgb(160,32,240)',
                                        borderWidth: 2,
                                        fill: false,
                                        tension: 0.1,
                                        data: [],
                                    } ]
                                } )
                        }
                }
                
            )
        }
    },[friction,typeCondition])

    //Implementation of download function
    //Nina Oehlckers (s213535)

    //setting the bounds for the query
    const [maxlat, setMaxLat] = useState(0)
    const [maxlon, setMaxLon] = useState(0)
    const [minlat, setMinLat] = useState(0)
    const [minlon, setMinLon] = useState(0)
    const [recdrawn, setRecDrawn] = useState<Boolean>(false)

    const _onCreate= (e : any) => {
        console.log(e.layer._bounds)
        setMaxLat(e.layer._bounds._northEast.lat)
        setMaxLon(e.layer._bounds._northEast.lng)
        setMinLat(e.layer._bounds._southWest.lat)
        setMinLon(e.layer._bounds._southWest.lng)
        setRecDrawn(true)
    }
    const _onEdit= (e : any) => {
        console.log("Edit shape")
        setMaxLat(e.layer._bounds._northEast.lat)
        setMaxLon(e.layer._bounds._northEast.lng)
        setMinLat(e.layer._bounds._southWest.lat)
        setMinLon(e.layer._bounds._southWest.lng)
        setRecDrawn(true)
    }

    const _onDelete= (e : any) => {
        console.log("Delete shape")
        setMaxLat(0)
        setMaxLon(0)
        setMinLat(0)
        setMinLon(0)
        setRecDrawn(false)
    }

    //only showing the downloader when a rectangle has been drawn
    let downloader;
    if (recdrawn == true){
        downloader = <Downloader maxlat={maxlat} minlat={minlat} maxlon={maxlon} minlon={minlon} type={typeCondition}/>
    }
    else{
        downloader = <h3></h3>
    }

    return (
        <div className="road-conditions-map" ref={ref}>
                <PaletteEditor 
                        defaultPalette={RENDERER_PALETTE}
                        width={width}
                        cursorOptions={ { scale: max, grid, samples } }
                        onChange={setPalette} />
    
            <MapWrapper>
                <Ways palette={palette} type={name} onClick={_onClick}  />
                <FeatureGroup>
                    <EditControl   
                        position='topright' 
                        onCreated={_onCreate}  
                        onDeleted={_onDelete} 
                        onEdited={_onEdit}    
                        draw={{
                            polygon:false,
                            polyline:false,
                            circlemarker:false,
                            circle: false,
                            marker:false
                        }}
                    />
                </FeatureGroup> 

            </MapWrapper>
            <TypeChanger/>
            {downloader}
        
        </div>
    )
}
export default ConditionsMap;
