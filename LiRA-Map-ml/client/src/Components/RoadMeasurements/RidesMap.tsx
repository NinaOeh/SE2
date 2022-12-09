import { FC, useMemo } from "react";
import { Palette } from "react-leaflet-hotline";

import { MeasProperties, ActiveMeasProperties } from "../../models/properties";
import { BoundedPath, MeasMetaPath } from "../../models/path";
import { RideMeta } from "../../models/models";

import PaletteEditor from "../Palette/PaletteEditor";
import { RENDERER_PALETTE } from "../Map/constants";
import MetadataPath from "../Map/MetadataPath";
import MapWrapper from "../Map/MapWrapper";
import { DotHover } from "../../assets/graph/types";
import { useState } from "react";
import { useEffect } from "react";

interface IRidesMap {
    paths: MeasMetaPath;
    selectedMetas: RideMeta[];
    selectedMeasurements: ActiveMeasProperties[];
}

const RidesMap: FC<IRidesMap> = ( { paths, selectedMetas, selectedMeasurements } ) => {

    const memoPaths = useMemo( () => {
        const temp: { meas: MeasProperties, meta: RideMeta, bp: BoundedPath }[] = []
        selectedMeasurements.forEach( meas => {
            const { name } = meas;
            return selectedMetas.forEach( meta => {
                const { TaskId } = meta; 
                if ( Object.hasOwn(paths, name) && Object.hasOwn(paths[name], TaskId) )
                {
                    console.log("bounds: ", paths[name][TaskId].bounds)
                    console.log(meas.rendererName)
                    if (paths[name][TaskId].bounds.maxX == null 
                        && paths[name][TaskId].bounds.maxY == null 
                        && paths[name][TaskId].bounds.minX == null 
                        && paths[name][TaskId].bounds.minY == null
                        && meas.rendererName == 'hotline')
                        {console.log("Here we now return undefined")
                        return undefined
                        }

                    else 
                        temp.push( 
                            { meas, meta, bp: paths[name][TaskId] }
                        )
                }
            } )
        } )
        return temp;
    }, [paths] )

    const onMouseover = (i: number) => (e: any) => {
        console.log("onMouseover in RidesMap", i, e);
    }

    const measgetsupdated = useEffect( () => {
        console.log(memoPaths);
    }, [memoPaths]);
    return (
        <MapWrapper>
            { memoPaths.map( ({bp, meas, meta}) => bp && 
                <MetadataPath 
                    key={`ride-mp-${meta.TaskId}-${meas.name}`} 
                    path={bp.path} 
                    properties={meas} 
                    metadata={meta} 
                    onMouseover={onMouseover}
                    isHovered={false}/> 
            ) }
        </MapWrapper>
    )
}

export default RidesMap;