import { FC, useEffect, useState } from "react";

import { MeasurementsProvider } from "../context/MeasurementsContext";
import { MetasProvider } from "../context/MetasContext";
import { RolesProvider } from "../context/RolesContext"

import RideDetails from "../Components/RoadMeasurements/RideDetails";
import RideCards from "../Components/RoadMeasurements/RideCards";
import Rides from "../Components/RoadMeasurements/Rides";
import { SegmentProvider } from "../context/SegmentContext"
import ClipLoader from "react-spinners/ClipLoader";
import CollapseButton from "../Components/RoadMeasurements/CollapseButton";


const RoadMeasurements = () => {
    const [loading, setLoading] = useState(false);
  
    useEffect( () => {
        setLoading(true);
    } )


    console.log("Road Measurement");
    useEffect( () => {
        setLoading(false);
    } )

    const [collapseRides, setCollapseRides] = useState(true);
    const handleCollapseRides = () => {
        setCollapseRides(!collapseRides);
    }

    const [collapseDetails, setCollapseDetails] = useState(true);
    const handleCollapseDetails = () => {
        setCollapseDetails(!collapseDetails);
    }

    return (
        <SegmentProvider>
            <div>
                {
            loading?
                <ClipLoader color={'#36c3d6b7'} loading={loading} size={150} aria-label="Loading Spinner" />
            :
                <MeasurementsProvider>
                    <MetasProvider>
                            <div className="rides-wrapper">
                                

                                {collapseRides && <RideCards />}
                                <input 
                                    type="checkbox" 
                                    className="collapse-checkbox"
                                    checked={collapseRides} 
                                    onChange={handleCollapseRides} />
                                
                                {collapseDetails && <RideDetails  />}
                                <input 
                                    type="checkbox" 
                                    className="collapse-checkbox"
                                    checked={collapseDetails} 
                                    onChange={handleCollapseDetails} />
                                <Rides />
                                
                            </div>
                    </MetasProvider>
                </MeasurementsProvider>
}
            </div>
        </SegmentProvider>
  )
}

export default RoadMeasurements;
