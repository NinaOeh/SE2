import { FC, useEffect, useState } from "react";

import { MeasurementsProvider } from "../context/MeasurementsContext";
import { MetasProvider } from "../context/MetasContext";
import { RolesProvider } from "../context/RolesContext"

import RideDetails from "../Components/RoadMeasurements/RideDetails";
import RideCards from "../Components/RoadMeasurements/RideCards";
import Rides from "../Components/RoadMeasurements/Rides";
import { SegmentProvider } from "../context/SegmentContext"
import ClipLoader from "react-spinners/ClipLoader";



const RoadMeasurements = () => {
    const [loading, setLoading] = useState(false);
  
    useEffect( () => {
        setLoading(true);
    } )


    console.log("Road Measurement");
    useEffect( () => {
        setLoading(false);
    } )
    return (
        <SegmentProvider>
            <div>
                {
            loading?
                <ClipLoader color={'#36c3d6b7'} loading={loading} size={150} aria-label="Loading Spinner" />
            :
                <MeasurementsProvider>
                    <MetasProvider>
                        <RolesProvider>
                            <div className="rides-wrapper">
                                
                                <RideCards />
                                
                                <RideDetails  />
                                
                                <Rides />
                                
                            </div>
                        </RolesProvider>
                    </MetasProvider>
                </MeasurementsProvider>
}
            </div>
        </SegmentProvider>
  )
}

export default RoadMeasurements;
