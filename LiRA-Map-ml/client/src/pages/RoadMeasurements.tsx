import { FC } from "react";

import { MeasurementsProvider } from "../context/MeasurementsContext";
import { MetasProvider } from "../context/MetasContext";

import RideDetails from "../Components/RoadMeasurements/RideDetails";
import RideCards from "../Components/RoadMeasurements/RideCards";
import Rides from "../Components/RoadMeasurements/Rides";
import { SegmentProvider } from "../context/SegmentContext"


const RoadMeasurements = () => {
    console.log("Road Measurement");
    return (
        <SegmentProvider>
            <div>
                <MeasurementsProvider>
                    <MetasProvider>
                        <div className="rides-wrapper">
                            
                            <RideCards />
                            
                            <RideDetails  />
                            
                            <Rides />
                            
                        </div>
                    </MetasProvider>
                </MeasurementsProvider>
            </div>
        </SegmentProvider>
  )
}

export default RoadMeasurements;
