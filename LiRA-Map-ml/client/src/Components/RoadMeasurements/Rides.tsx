import { FC, useEffect, useState } from "react";

import { useMeasurementsCtx } from "../../context/MeasurementsContext";
import { GraphProvider } from "../../context/GraphContext";
import { useMetasCtx } from "../../context/MetasContext";

import { ActiveMeasProperties } from "../../models/properties";
import { MeasMetaPath, Path, PointData } from "../../models/path";

import { DotHover, GraphData, GraphPoint } from "../../assets/graph/types";

import { getRide } from "../../queries/rides";

import Graph from "../Graph/Graph";
import RidesMap from "./RidesMap";
import usePopup from "../createPopup";
import { Popup } from "Leaflet.MultiOptionsPolyline";
import { PopupFunc } from "../../models/popup"
import { RendererName } from "../../models/renderers";
import Checkbox from "../Checkbox";
import { RideMeta } from "../../models/models";

const Rides: FC = () => {
    
    const { selectedMetas, setHoveredMeta } = useMetasCtx()
    const { selectedMeasurements } = useMeasurementsCtx()

    const [ paths, setPaths ] = useState<MeasMetaPath>({})
    
    const popup = usePopup()

    useEffect( () => {
        const updatePaths = async ( pop: PopupFunc) => {
            const temp = {} as MeasMetaPath;

            if(selectedMeasurements.length == 0){
                const activeBaselineMeasurement: ActiveMeasProperties = {
                    dbName: "track.pos",
                    name: "baseline reading without measurements",
                    hasValue: false,
                    rendererName: RendererName.line,
                    color: 'black',
                    isActive: true,
                };
                selectedMeasurements.push(activeBaselineMeasurement);
            }

            for ( let meas of selectedMeasurements )
            {
                const { name } = meas
                temp[name] = {}
                for ( let meta of selectedMetas )
                {
                    const { TaskId } = meta;
    
                    if ( Object.hasOwn(paths, name) && Object.hasOwn(paths[name], TaskId) )
                        {temp[name][TaskId] = paths[name][TaskId]}
                        
                    else {
                        const bp = await getRide(meas, meta, popup)
                        if ( bp !== undefined )
                        {
                            temp[name][TaskId] = bp;
                        }
                    }

                    if (temp[name][TaskId].bounds.maxX == null 
                        && temp[name][TaskId].bounds.maxY == null 
                        && temp[name][TaskId].bounds.minX == null 
                        && temp[name][TaskId].bounds.minY == null
                        && meas.rendererName == 'hotline')
                        {
                        popup( {
                            icon: "warning",
                            title: `Hotline renderer can not be chosen for this measurement.`,
                            footer: `Choose another type of visualization for ${name} | TaskId: ${TaskId}`,
                            toast: true
                        } );
                        }
                } 
            }

            return temp;
        }
        updatePaths(popup).then( setPaths )

    }, [selectedMetas, selectedMeasurements] )

    const [collapseGraph, setCollapseGraph] = useState(true);
    const handleCollapseGraph = () => {
        setCollapseGraph(!collapseGraph);
    }

    // const [hoveredMeta, setHoveredMeta] = useState<RideMeta>();
    // const hovMeta = useEffect(() => {
    //     console.log("Onmouseover registreret i rides, meta is ", hoveredMeta);
    //     setHoveredMeta(hoveredMeta);
    //     // selectedMetas.find(meta => meta.TaskId == hoveredMeta?.TaskId)!.isHovered = true;
    // },[hoveredMeta]);

    return (
        <GraphProvider>
            <div className="map-container">

                <RidesMap
                    paths={paths} 
                    selectedMetas={selectedMetas} 
                    selectedMeasurements={selectedMeasurements}
                    setHoveredMeta={setHoveredMeta}/>

                <Checkbox className="collapse-checkbox horizontal-checkbox" 
                                html={
                                    collapseGraph ? 
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-chevron-double-down" viewBox="0 0 16 16">
                                        <path fill-rule="evenodd" d="M1.646 6.646a.5.5 0 0 1 .708 0L8 12.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z"/>
                                        <path fill-rule="evenodd" d="M1.646 2.646a.5.5 0 0 1 .708 0L8 8.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z"/>
                                    </svg> :
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-chevron-double-up" viewBox="0 0 16 16">
                                        <path fill-rule="evenodd" d="M7.646 2.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1-.708.708L8 3.707 2.354 9.354a.5.5 0 1 1-.708-.708l6-6z"/>
                                        <path fill-rule="evenodd" d="M7.646 6.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1-.708.708L8 7.707l-5.646 5.647a.5.5 0 0 1-.708-.708l6-6z"/>
                                    </svg>
                                } 
                                forceState={collapseGraph} onClick={handleCollapseGraph}/>

                { selectedMeasurements.map( ({hasValue, name, palette}: ActiveMeasProperties, i: number) => hasValue &&
                    <Graph 
                        key={`graph-${i}`}
                        labelX="Time (h:m:s)" 
                        labelY={name}
                        absolute={true}
                        time={true}
                        palette={palette}
                        mapData={Object.entries(paths[name] || {})
                                .map( ([TaskId, bp], j) => {
                                    const { path, bounds} = bp;
                                    return path;
                                })
                            }
                        plots={ Object.entries(paths[name] || {})
                            .map( ([TaskId, bp], j) => {
                                const { path, bounds } = bp;
                                const x = (p: PointData) => new Date(p.metadata.timestamp).getTime()
                                const data: GraphData = path
                                    .map( p => [x(p), p.value || 0] as GraphPoint )
                                    .sort( ([x1, y1], [x2, y2]) => (x1 < x2) ? -1 : (x1 === x2) ? 0 : 1 )
                                return { data, bounds, label: 'r-' + TaskId, j }
                            } ) 
                        }
                        isCollapsed={!collapseGraph}
                    />
                ) }
            </div>
        </GraphProvider>
  )
}

export default Rides;
