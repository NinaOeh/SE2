
import { FC, useEffect, useState } from "react"

import GLine from "../../assets/graph/line"

import { useGraph } from "../../context/GraphContext";

import { Axis, DotHover, GraphData, SVG } from "../../assets/graph/types"
import { Bounds, MeasMetaPath, Path } from "../../models/path";

interface ILine {
    svg: SVG;
    xAxis: Axis | undefined;
    yAxis: Axis | undefined;
    data: GraphData;
    bounds?: Bounds;
    label: string; i: number;
    time: boolean | undefined;
    mapData: Path[];
}

const Line: FC<ILine> = ( { svg, xAxis, yAxis, data, mapData, bounds, label, i, time } ) => {
    let firstData = data[0][0];

    for(let i2 = 0; i2<data.length; i2++){
        data[i2][0]  -= firstData ;

    }
    

    const { addBounds, remBounds, setDotHover } = useGraph()


    useEffect( () => {

        if ( xAxis === undefined || yAxis === undefined ) return;

        const _bounds: Required<Bounds> = Object.assign( {
            minX: Math.min(...data.map( d => d[0] )),
            maxX: Math.max(...data.map( d => d[0] )),
            minY: Math.min(...data.map( d => d[1] )),
            maxY: Math.max(...data.map( d => d[1] )),
        } )

       
        addBounds(label, _bounds)

        // const onHover = (d: DotHover | undefined) => d === undefined 
        //     ? setDotHover( undefined )
        //     : setDotHover( { ...d, x: d.x / _bounds.maxX } )

        const onHover = (d: DotHover | undefined) => {
            if(d !== undefined){
                setDotHover(d);
            } else {
                setDotHover(undefined);
            }

        }

        const line = new GLine(svg, label, i, data, mapData[i], xAxis, yAxis, onHover, time)

        return () => {
            if ( svg === undefined )
                return console.log('ERROR, TRYING TO REMOVE GRAPH DATA WHILE SVG = undefined');

            line.rem()
            remBounds(label)
        }

    }, [svg, xAxis, yAxis, data, label, bounds, i, setDotHover])

    return null

}

export default Line