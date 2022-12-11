//ELiot Ullmo

import { FC, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ChartData } from "chart.js";
import { Palette } from "react-leaflet-hotline";
import { Polygon, Circle } from "react-leaflet";

import MapWrapper from "../Map/MapWrapper";
import { RENDERER_PALETTE } from "../Map/constants";
import PaletteEditor from "../Palette/PaletteEditor";
import Ways from "./Ways";

import useSize from "../../hooks/useSize";

import { ConditionType } from "../../models/graph";
import { Condition } from "../../models/path";

import { getConditions } from "../../queries/conditions";
import { filter } from "d3";
import createPopup from "../createPopup";
import FilteringSelector from "./DropDown"
import { FilteringOptions } from "../../models/models";
import { useGraph } from "../../context/GraphContext";
import Menu from "./Menu";
import TypeChanger from "./Slider";
import { getFrictConditions } from "../../queries/friction";


//import 'leaflet-draw/dist/leaflet.draw.css'
//import { EditControl } from "react-leaflet-draw";
//import { FeatureGroup } from "react-leaflet";
import { circle } from "Leaflet.MultiOptionsPolyline";

const hollywoodStudiosPolygon : [number, number][] = [
      [ 28.35390453844, -81.56443119049 ],
      [ 28.35390453844, -81.55619144439 ],
      [ 28.35983376526, -81.55619144439 ],
      [ 28.35983376526, -81.56443119049 ],
      [ 28.35390453844, -81.56443119049 ],
  ];

//const epcotCenter :  [number, number][]  = [28.373711392892478, -81.54936790466309];

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

    const onClick = useCallback((way_id: string, way_length: number,f:number) => {
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

                        
                    /**  const popup=createPopup();
                        popup( {
                            icon: "warning",
                            title: `This trip doesn't have any value with the ira wanted   `,
                            toast: true,

                        } ); */

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

                            
                        /**  const popup=createPopup();
                            popup( {
                                icon: "warning",
                                title: `This trip doesn't have any value with the ira wanted   `,
                                toast: true,

                            } ); */

                        }
                    
                    
                
                
                }
                
            )
        }
    },[friction,typeCondition])

    const _onCreate= (e : any) => {
        console.log(e)
    }
    const _onEdit= (e : any) => {
        console.log(e)
    }

    const _onDelete= (e : any) => {
        console.log(e)
    }



    return (
        <div className="road-conditions-map" ref={ref}>

                <PaletteEditor 
                        defaultPalette={RENDERER_PALETTE}
                        width={width}
                        cursorOptions={ { scale: max, grid, samples } }
                        onChange={setPalette} />
    
            <MapWrapper>
                <Ways palette={palette} type={name} onClick={onClick}  />
                {/*<Circle color="magenta" center={epcotCenter} radius={400} />*/}
                {/*<Polygon color="blue" positions={hollywoodStudiosPolygon} /> */}  //

               {/* <FeatureGroup>
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
                    </FeatureGroup> */}

            </MapWrapper>
            
            <TypeChanger/>

        

        </div>
    )
}

export default ConditionsMap;
