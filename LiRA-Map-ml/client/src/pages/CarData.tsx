import { FC, useState } from "react";
import { LatLng } from "leaflet";
import MapWrapper from "../Components/Map/MapWrapper";
import MapEvents from "../Components/CarData/MapEvents";
import Segments from "../Components/CarData/Segments";
import Toolbars from "../Components/CarData/toolbar/Toolbars";

import { SegmentProvider } from "../context/SegmentContext";


export interface SegTypes {
    dataType: string | undefined;
    aggrType: string | undefined;
    direction: number | undefined;
}

const CarData = () => {

    const [boundaries, setBoundaries] = useState<LatLng[]>([
        new LatLng(55.523966596348956, 12.030029296875002),
        new LatLng(55.523966596348956, 12.74620056152344),
        new LatLng(55.8089989927049, 12.74620056152344),
        new LatLng(55.8089989927049, 12.030029296875002)
    ]);

    const [isOpen, setIsOpen] = useState(false);
    console.log("Hallihallo");
    const togglePopup = () => {
      setIsOpen(!isOpen);
    }
   
    return (
        <SegmentProvider>
            <div className="ml-wrapper">
                <div>
                    <input
                        type="button"
                        value="Click to Open Popup"
                        onClick={togglePopup}
                    />
                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
                </div>
                <MapWrapper>
                        <Segments boundaries={boundaries} /> 
                        <MapEvents setBoundaries={setBoundaries}></MapEvents>        
                    </MapWrapper>
            </div>
        </SegmentProvider>
    );
  }
   
  export default CarData;
    