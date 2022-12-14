// modified by Nina Oehlckers (s213535) -> adding delete option
import React, { FC } from "react";
import { FiSettings, FiXSquare } from "react-icons/fi"; 
import { MeasProperties } from "../../models/properties";
import Checkbox from "../Checkbox";


interface ICheckboxHTML {
    meas: MeasProperties;
    editMeasurement: (e: React.MouseEvent) => void;
    deleteMeasurement: (e: React.MouseEvent) => void;
}

const CheckboxHTML: FC<ICheckboxHTML> = ( { meas, editMeasurement, deleteMeasurement } ) => {
    const { name, rendererName } = meas;

    return (
        <div className="checkbox-container">
            <div className="checkbox-text">
                <div className="checkbox-title">{name}</div>
                <p className="checkbox-subtitle">- {rendererName}</p>
            </div>
            <FiSettings className="edit-meas-btn btn" onClick={editMeasurement} strokeWidth={1}/>
            <FiXSquare className="edit-meas-btn btn" onClick={deleteMeasurement} strokeWidth={1}/>
        </div>
    )
}
    
interface IMeasCheckbox {
    meas: MeasProperties;
    editMeasurement: (e: React.MouseEvent) => void;
    deleteMeasurement: (e: React.MouseEvent) => void;
    selectMeasurement: (isChecked: boolean) => void; 
    state: boolean; 

}

const MeasCheckbox: FC<IMeasCheckbox> = ( { meas, editMeasurement, selectMeasurement, deleteMeasurement,state } ) => {
    return (
        <Checkbox 
            className='ride-metadata-checkbox'
            html={<CheckboxHTML meas={meas} editMeasurement={editMeasurement} deleteMeasurement={deleteMeasurement} />}
            onClick={selectMeasurement} 
            forceState = {state}
            /> 
        
    )
}

export default MeasCheckbox;