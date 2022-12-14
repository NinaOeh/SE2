import { useEffect, useState } from "react";
import { MeasurementsProvider } from "../context/MeasurementsContext";
import { MetasProvider } from "../context/MetasContext";
import RideDetails from "../Components/RoadMeasurements/RideDetails";
import RideCards from "../Components/RoadMeasurements/RideCards";
import Rides from "../Components/RoadMeasurements/Rides";
import { SegmentProvider } from "../context/SegmentContext"
import ClipLoader from "react-spinners/ClipLoader";
import Checkbox from "../Components/Checkbox";


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
        console.log("Collapse rides? ", collapseRides);
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
                                

                                <RideCards isCollapsed={!collapseRides}/>
                                <Checkbox className="collapse-checkbox" 
                                html={
                                    collapseRides ? 
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-chevron-double-left" viewBox="0 0 16 16">
                                        <path fillRule="evenodd" d="M8.354 1.646a.5.5 0 0 1 0 .708L2.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0z"/>
                                        <path fillRule="evenodd" d="M12.354 1.646a.5.5 0 0 1 0 .708L6.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0z"/>
                                    </svg> :
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-chevron-double-right" viewBox="0 0 16 16">
                                        <path fillRule="evenodd" d="M3.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L9.293 8 3.646 2.354a.5.5 0 0 1 0-.708z"/>
                                        <path fillRule="evenodd" d="M7.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L13.293 8 7.646 2.354a.5.5 0 0 1 0-.708z"/>
                                    </svg>
                                } forceState={collapseRides} onClick={handleCollapseRides}/>
                               
                                <RideDetails isCollapsed={!collapseDetails}/>
                                <Checkbox className="collapse-checkbox" 
                                html={
                                    collapseDetails ? 
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-chevron-double-left" viewBox="0 0 16 16">
                                        <path fillRule="evenodd" d="M8.354 1.646a.5.5 0 0 1 0 .708L2.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0z"/>
                                        <path fillRule="evenodd" d="M12.354 1.646a.5.5 0 0 1 0 .708L6.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0z"/>
                                    </svg> :
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-chevron-double-right" viewBox="0 0 16 16">
                                        <path fillRule="evenodd" d="M3.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L9.293 8 3.646 2.354a.5.5 0 0 1 0-.708z"/>
                                        <path fillRule="evenodd" d="M7.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L13.293 8 7.646 2.354a.5.5 0 0 1 0-.708z"/>
                                    </svg>
                                } forceState={collapseDetails} onClick={handleCollapseDetails}/>
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
