import React, { FC, useState } from "react";

import useMeasPopup from "./Popup/useMeasPopup";
import Checkbox from "../Checkbox";
import MetaData from "./MetaData";

import { useMeasurementsCtx } from "../../context/MeasurementsContext";
import { useMetasCtx } from "../../context/MetasContext";

import { addMeasurement } from "../../queries/measurements";
import { MeasProperties, ActiveMeasProperties } from "../../models/properties";
import { RideMeta } from "../../models/models";

import { RENDERER_MEAS_PROPERTIES } from "../Map/constants";

import MeasCheckbox from "./MeasCheckbox";

import '../../css/ridedetails.css'

const RideDetails: FC = () => {

	const { selectedMetas } = useMetasCtx()

	const { measurements, setMeasurements } = useMeasurementsCtx()
	const [ addChecked, setAddChecked ] = useState<boolean>(false)
	
	const popup = useMeasPopup()

	const edit_Measurement = (meas: ActiveMeasProperties, i: number) => (e: React.MouseEvent) => {
		e.preventDefault()
		e.stopPropagation()
		console.log("jhswjhsiu");

		popup( 
			(newMeas: ActiveMeasProperties) => {
				const temp = [...measurements]
				temp[i] = newMeas;
				setMeasurements( temp )
				editMeasurement(newMeas, i)
			}, 
			{ ...RENDERER_MEAS_PROPERTIES, ...meas } 
		)
	}


	const delete_measurement = ( i: number) => (e: React.MouseEvent) => {
		e.preventDefault()
		e.stopPropagation()
		console.log(i)
		//removes one element in position i from the state
		const temp = [...measurements]
		temp.splice(i,1)
		setMeasurements(temp)
		// and add the measurement to the measurements.json file
		deleteMeasurement(i);
	}

	const showAddMeasurement = () => {
		setAddChecked(true) 
		popup( 
			(newMeasurement: ActiveMeasProperties ) => {
				setAddChecked(false) 
				// update the state in RideDetails
				setMeasurements( prev => [...prev, newMeasurement])
				// and add the measurement to the measurements.json file
				addMeasurement(newMeasurement);
			},
			RENDERER_MEAS_PROPERTIES 
		)
	}

    const selectMeasurement = (i: number) => (isChecked: boolean) => {        
        const temp = [...measurements]
        temp[i].isActive = isChecked
        setMeasurements(temp)
    }

    return (
		<div className="meta-data">
			{ measurements.map( (m: ActiveMeasProperties, i: number) =>
				<MeasCheckbox 
					key={`meas-checkbox-${i}`}
					meas={m}
					selectMeasurement={selectMeasurement(i)}

					editMeasurement={edit_Measurement(m, i)}
					deleteMeasurement={delete_measurement(i)} />
			) }

			<Checkbox 
				className='ride-metadata-checkbox md-checkbox-add'
				html={<div>+</div>}
				forceState={addChecked}
				onClick={showAddMeasurement} />
			
			{ selectedMetas.map( (meta: RideMeta, i: number) =>
				<MetaData md={meta} key={`md-${Math.random()}`} />
			) }
        </div>
  )
}

export default RideDetails;