// Modified by Nina Oehlckers (s213535) -> multiple changes of setup, inclusing of dropdown to search measurements
import React, { FC, useState, useRef } from "react";
import { TwitterPicker } from "react-color";
import { Gradient } from "react-gradient-hook";

import { RendererName, rendererTypes } from "../../../models/renderers";

import Checkbox from "../../Checkbox";
import { ActiveMeasProperties } from "../../../models/properties";
import { MeasurementDatabases } from "../../../models/measurements";

import Dropdown from "./Dropdown";


interface IPopupWrapper {
    defaultOptions: Required<ActiveMeasProperties>;
    setOptions: (newOpts: Required<ActiveMeasProperties>) => void;
}

const PopupWrapper: FC<IPopupWrapper> = ( { defaultOptions, setOptions } ) => {

    const [state, setState] = useState(defaultOptions);
    const { name, dbName, rendererName, color } = state;

    const update = (key: keyof ActiveMeasProperties) => (val: any) => {
        const temp = { ...state } as any;
        temp[key] = val;
        if (key == "dbName"){
            temp["name"] = Object.keys(MeasurementDatabases)[Object.values(MeasurementDatabases).indexOf(val)];
        }
        setState(temp)
        setOptions(temp)
    }

    /*Functions necessary for the dropdown Menu */
    //Author: Nina (s213535)
    const [showDropDown, setShowDropDown] = useState<boolean>(false);
    const [selectMeasurement, setSelectMeasurement] = useState<string>(name);
    
    const toggleDropDown = () => {
      setShowDropDown(!showDropDown);
    };

    const dismissHandler = (event: React.FocusEvent<HTMLButtonElement>): void => {
      if (event.currentTarget === event.target) {
        setShowDropDown(false);
      }
    };
  
    const measurementSelection = (measurement: string): void => {
      setSelectMeasurement(measurement);
      update('dbName')(Object.values(MeasurementDatabases)[Object.keys(MeasurementDatabases).indexOf(measurement)]);
      setShowDropDown(false);
      clearInput();
    };

    /*Functions necessary for the search*/
    //Author: Nina (s213535)
    const [filteredData, setFilteredData] = useState<string[]>(Object.keys(MeasurementDatabases))
    const [wordEntered, setWordEntered] = useState<string>("")

    const handleFilter = ({
        target,
      }: React.ChangeEvent<HTMLInputElement>): void => {
        const searchWord: string = target.value.toLowerCase()
        setWordEntered(searchWord)
    
        const newFilter: string[] = Object.keys(MeasurementDatabases).filter((v): boolean =>
          v.toLowerCase().includes(searchWord)
        )
    
        if (!searchWord) return setFilteredData(Object.keys(MeasurementDatabases))
        setFilteredData(newFilter)
        console.log("filtered Data",filteredData)
      }
    const clearInput = (): void => {
        setFilteredData(Object.keys(MeasurementDatabases))
        setWordEntered("")
    }
    

    //this is the popup that appears when pressing the "+" on the website
    // Object.keys(RendererName) returns the keys, so an array of [class, property, bounds..]
    //.map populates the function with new values (like lambda function in python=)
    //div classes defined in popup.css
    /**onClick now updates the dbName based on the value in the enum that lists the possible measurements. **/
    return (
        <div className="popup-wrapper" id="popupwrapper">    
            <div>
            {/*!--- Start of left column ---*/}
                <div>
                    <div>
                    <>  
                        <div>
                            <h3>
                            {selectMeasurement 
                                ? selectMeasurement 
                                : "Select Measurement..."} 
                            </h3>
                        </div>  

                                           
                        <button 
                            className={showDropDown ? "dropdownbutton active" : "dropdownbutton"}
                            onBlur={(e: React.FocusEvent<HTMLButtonElement>): void =>
                            dismissHandler(e)
                            }
                            onClick={(): void => toggleDropDown()}
                        > 
                            <input
                                className="dropdowninputs"
                                type="text"
                                placeholder= {selectMeasurement ?selectMeasurement+", click to change" :"Search"}
                                value={wordEntered}
                                onChange={handleFilter}
                            />
                        
                            {showDropDown && (
                            <Dropdown
                                measurements={filteredData} 
                                showDropDown={false}
                                toggleDropDown={(): void => toggleDropDown()}
                                measurementSelection={measurementSelection}
                            />
                            )}
                    </button>
                    </>
                    </div>
                </div>
            {/*!--- End of left column ---*/}
            </div>
            <div >
            {/*!--- Start of right column ---*/}
                <div>
                    <div className="sweetalert-checkboxes">
                        { Object.keys(RendererName).map( (rName: string, i: number) => 
                            <Checkbox 
                                key={`sweetalert-checkbox-${i}`}
                                className='ride-metadata-checkbox'
                                html={<div style={{textTransform: "capitalize"}}>{rName}</div>}
                                forceState={rName === rendererName}
                                onClick={() => update('rendererName')(rName)} />
                        ) }
                    </div>
                    { rendererTypes[rendererName].usePalette 
                        ? <Gradient
                            key={`gradient-${rendererName}`}
                            defaultColors={rendererTypes[rendererName].defaultPalette} 
                            cursorOptions={{grid: true, samples: 40}} 
                            pickerOptions={{showCircles: false}}
                            onChange={update('palette')} />
                        : <TwitterPicker color={color} onChange={c => update('color')(c.hex)} />
                    }
                </div>
            {/*!--- End of right column ---*/}
            </div>
        </div>
    )
}

export default PopupWrapper;