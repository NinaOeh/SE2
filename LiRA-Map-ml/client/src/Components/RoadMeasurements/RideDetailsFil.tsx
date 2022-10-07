import React, { FC, useState } from "react";

import PopupFilter from "./Popup/PopupFilter";
import Checkbox from "../Checkbox";
import MetaData from "./MetaData";

import { useFilterCtx } from "../../context/FilterContext";
import { useMetasCtx } from "../../context/MetasContext";

import { addMeasurement } from "../../queries/filters";
import { FilProperties, ActiveFilProperties } from "../../models/properties";
import { RideMeta } from "../../models/models";

import { RENDERER_FIL_PROPERTIES } from "../Map/constants";

import FilCheckbox from "./FilCheckbox";

import '../../css/ridedetails.css'

const RideDetails: FC = () => {

	const { selectedMetas } = useMetasCtx()

	const { measurements, setMeasurements } = useFilterCtx()
	const [ addChecked, setAddChecked ] = useState<boolean>(false)
	
	const popup = PopupFilter()

	const editFilter = (meas: ActiveFilProperties, i: number) => (e: React.MouseEvent) => {
		e.preventDefault()
		e.stopPropagation()

		popup( 
			(newMeas: ActiveFilProperties) => {
				const temp = [...measurements]
				temp[i] = newMeas;
				setMeasurements( temp )
			}, 
			{ ...RENDERER_FIL_PROPERTIES, ...meas } 
		)
	}

	const showAddFilter = () => {
		setAddChecked(true) 
		popup( 
			(newMeasurement: ActiveFilProperties ) => {
				setAddChecked(false) 
				// update the state in RideDetails
				setMeasurements( prev => [...prev, newMeasurement])
				// and add the measurement to the measurements.json file
				addMeasurement(newMeasurement);
			},
			RENDERER_FIL_PROPERTIES 
		)
	}

    const selectFilter = (i: number) => (isChecked: boolean) => {        
        const temp = [...measurements]
        temp[i].isActive = isChecked
        setMeasurements(temp)
    }

    return (
		<div className="meta-data">
			{ measurements.map( (m: ActiveFilProperties, i: number) =>
				<FilCheckbox 
					key={`meas-checkbox-${i}`}
					fil={m}
					selectFilter={selectFilter(i)}
					editFilter={editFilter(m, i)} />
			) }

			<Checkbox 
				className='ride-metadata-checkbox md-checkbox-add'
				html={<div>+</div>}
				forceState={addChecked}
				onClick={showAddFilter} />
			
			{ selectedMetas.map( (meta: RideMeta, i: number) =>
				<MetaData md={meta} key={`md-${Math.random()}`} />
			) }
        </div>
  )
}

export default RideDetails;