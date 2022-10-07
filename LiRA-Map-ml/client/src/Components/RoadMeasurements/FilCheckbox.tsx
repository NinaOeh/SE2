import React, { FC } from "react";
import { FiSettings } from "react-icons/fi";
import { FilProperties } from "../../models/properties";
import Checkbox from "../Checkbox";


interface ICheckboxHTML {
    fil: FilProperties;
    editFilter: (e: React.MouseEvent) => void;
}

const CheckboxHTML: FC<ICheckboxHTML> = ( { fil, editFilter } ) => {
    const { dFilter, rendererName } = fil;

    return (
        <div className="checkbox-container">
            <div className="checkbox-text">
                <div className="checkbox-title">{dFilter}</div>
                <p className="checkbox-subtitle">- {rendererName}</p>
            </div>
            <FiSettings className="edit-fil-btn btn" onClick={editFilter} strokeWidth={1}/>
        </div>
    )
}
    
interface IFilCheckbox {
    fil: FilProperties;
    editFilter: (e: React.MouseEvent) => void;
    selectFilter: (isChecked: boolean) => void; 
}

const FilCheckbox: FC<IFilCheckbox> = ( { fil, editFilter, selectFilter } ) => {
    return (
        <Checkbox 
            className='ride-metadata-checkbox'
            html={<CheckboxHTML fil={fil} editFilter={editFilter} />}
            onClick={selectFilter} />
    )
}

export default FilCheckbox;