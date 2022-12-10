import React, { FC, useMemo } from "react";
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
    setHoveredMeta: React.Dispatch<React.SetStateAction<RideMeta | undefined>>;
}

const RidesMap: FC<IRidesMap> = ( { paths, selectedMetas, selectedMeasurements, setHoveredMeta} ) => {

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
        var meta = selectedMetas.find(meta => meta.TaskId == i);
        setHoveredMeta(meta);
    }

    return (
        <MapWrapper>
            { memoPaths.map( ({bp, meas, meta}) => bp && 
                <MetadataPath 
                    key={`ride-mp-${meta.TaskId}-${meas.name}`} 
                    path={bp.path} 
                    properties={meas} 
                    metadata={meta} 
                    onMouseover={onMouseover}/> 
            ) }
        </MapWrapper>
    )
}

export default RidesMap;