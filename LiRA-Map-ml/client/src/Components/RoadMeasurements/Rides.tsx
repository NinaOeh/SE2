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

const Rides: FC = () => {
    
    const { selectedMetas } = useMetasCtx()
    const { selectedMeasurements } = useMeasurementsCtx()

    const [ paths, setPaths ] = useState<MeasMetaPath>({})
    const [ dotHover, setDotHover ] = useState<DotHover>()
    
    useEffect(() => {
		console.log("Nu sker der et eller andet i Rides", dotHover)
	}, [dotHover])  

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

    return (
        <GraphProvider>
            <div className="map-container">

                <RidesMap
                    paths={paths} 
                    selectedMetas={selectedMetas} 
                    selectedMeasurements={selectedMeasurements}  />

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
                    />
                ) }
            </div>
        </GraphProvider>
  )
}

export default Rides;
