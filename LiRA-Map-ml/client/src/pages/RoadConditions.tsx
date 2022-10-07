
import { useState } from "react";
import { Palette } from "react-leaflet-hotline";
import { ChartData } from "chart.js";

import ConditionsMap from "../Components/RoadConditions/ConditionsMap";
import ConditionsGraph from "../Components/RoadConditions/ConditionsGraph";

import { ConditionType } from "../models/graph";

import { GraphProvider } from "../context/GraphContext";
import { FilterProvider } from "../context/FilterContext";
import { MetasProvider } from "../context/MetasContext";

import RideDetails from "../Components/RoadMeasurements/RideDetailsFil";

import "../css/road_conditions.css";
import React from "react";


const RoadConditions = () => {
    
    const [palette, setPalette] = useState<Palette>([])
    const [wayData, setWayData] = useState<ChartData<"line", number[], number>>()

    const type: ConditionType = {
        name: 'IRI',
        min: 0,
        max: 10,
        grid: true,
        samples: 40
    }

    return (
        <React.Fragment>
            <FilterProvider>
            <MetasProvider>
                <div className="road-filter-wrapper">
                    <RideDetails />
                </div>
            </MetasProvider>    
            </FilterProvider> 
            <GraphProvider>
                <div className="road-conditions-wrapper">
                    <ConditionsMap type={type} palette={palette} setPalette={setPalette} setWayData={setWayData} />
                    <ConditionsGraph type={type} palette={palette} data={wayData} />
                </div>
            </GraphProvider>
        </React.Fragment>
    );
}

export default RoadConditions;