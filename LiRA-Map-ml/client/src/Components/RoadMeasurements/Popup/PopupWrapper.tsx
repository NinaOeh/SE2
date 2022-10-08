import React, { FC, useState } from "react";
import { TwitterPicker } from "react-color";
import { Gradient } from "react-gradient-hook";

import { RendererName, rendererTypes } from "../../../models/renderers";

import Checkbox from "../../Checkbox";
import { ActiveMeasProperties } from "../../../models/properties";
import { MeasurementDatabases } from "../../../models/measurements";
import  RadioMeasurements  from "../RadioButtons/RadioButton"
import MeasurementMenu from "../Dropdown/DropdownMenu"

import Dropdown from "../Dropdown/Dropdown";


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
        console.log(name)
        console.log(dbName)
    }

    const inputChange = (key: keyof ActiveMeasProperties) => ({target}: any) => update(key)(target.value)

    /*Functions necessary for the RadioItem Menu */
    const [selectRadio, setSelectRadio] = useState<string>("");
    const RadioSelection = (measurement: string): void => {
        setSelectRadio(measurement);
        update('dbName')(Object.values(MeasurementDatabases)[Object.keys(MeasurementDatabases).indexOf(measurement)])
        update('name')(measurement)
    };


    /*Functions necessary for the dropdown Menu */
    const [showDropDown, setShowDropDown] = useState<boolean>(false);
    const [selectMeasurement, setSelectMeasurement] = useState<string>("");
    /**
     * Toggle the drop down menu
     */
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
      update('dbName')(Object.values(MeasurementDatabases)[Object.keys(MeasurementDatabases).indexOf(measurement)])
    };

    //this is the popup that appears when pressing the "+" on the website
    // Object.keys(RendererName) returns the keys, so an array of [class, property, bounds..]
    //.map populates the function with new values (like lambda function in python=)
    //div classes defined in popup.css
    /**onClick now updates the dbName based on the value in the enum that lists the possible measurements. **/
    //<input className="sweetalert-input" placeholder="Hello Sun" type='text' defaultValue={dbName} onChange={inputChange('dbName')}/>
    
    return (
        <div className="popup-wrapper">    
            <input className="sweetalert-input" placeholder="Name" type='text' defaultValue={name} onChange={inputChange('name')}/>
            <div className="announcement">
                <div>
                    {dbName}
                </div>
            </div>
            <div className="float-child">
            {/*!--- Start of left column ---*/}
                <div>
                    {/*
                    <div className="sweetalert-checkboxes">
                        { Object.keys(MeasurementDatabases).map( (mName: string, i: number) => 
                            <Checkbox 
                                key={`sweetalert-checkbox-${i}`}
                                className='ride-metadata-checkbox'
                                html={<div style={{textTransform: "capitalize"}}>{mName}</div>}
                                forceState={Object.values(MeasurementDatabases)[Object.keys(MeasurementDatabases).indexOf(mName)] === dbName}
                                onClick={() => update('dbName')(Object.values(MeasurementDatabases)[Object.keys(MeasurementDatabases).indexOf(mName)])
                                }/>
                        ) }
                    </div>

                    <div className="sweetalert-checkboxes">
                        { Object.keys(MeasurementDatabases).map( (mName: string, i: number) => 
                            <RadioMeasurements
                                key={`sweetalert-checkbox-${i}`}
                                name= {mName}//{mName}
                                html={<div style={{textTransform: "capitalize"}}>{mName}</div>}
                                onChange={() => update('dbName')(Object.values(MeasurementDatabases)[Object.keys(MeasurementDatabases).indexOf(mName)])}/>
                        ) }
                    </div>*/}

                    <div>
                    <>
                        <div className="announcement">
                            <div>
                            {selectMeasurement
                                ?"Measurement:"
                                :"Measurement:"}
                            </div>
                        </div>
                        
                        <button 
                            className={showDropDown ? "dropdownbutton active" : "dropdownbutton"}
                            onClick={(): void => toggleDropDown()}
                            onBlur={(e: React.FocusEvent<HTMLButtonElement>): void =>
                            dismissHandler(e)
                            }
                        >
                            <div>
                            {selectMeasurement 
                                ? selectMeasurement 
                                : "Select ..."} 
                            </div>
                            {showDropDown && (
                            <Dropdown
                                measurements={Object.keys(MeasurementDatabases)} //cities
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
            <div className="float-child">
            {/*!--- Start of right column ---*/}
                <div>
                    <div>
                    Choose settings for visualization
                    </div>
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