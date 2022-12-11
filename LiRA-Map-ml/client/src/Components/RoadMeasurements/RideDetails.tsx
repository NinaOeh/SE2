import React, { FC, useState } from "react";
import createPopup from "../createPopup";
import addMeasPopup from "./Popup/addMeasurementPopup";
import Checkbox from "../Checkbox";
import MetaData from "./MetaData";

import { useMeasurementsCtx } from "../../context/MeasurementsContext";
import { useMetasCtx } from "../../context/MetasContext";
import { UseRoleContext } from "../../context/RolesContext";

import { addMeasurement, deleteMeasurement, editMeasurement } from "../../queries/measurements";
import { MeasProperties, ActiveMeasProperties } from "../../models/properties";
import { RideMeta } from "../../models/models";

import { RENDERER_MEAS_PROPERTIES } from "../Map/constants";

import MeasCheckbox from "./MeasCheckbox";

import '../../css/ridedetails.css'


interface RideDetailsProps {
	isCollapsed: boolean;
}

const RideDetails: FC<RideDetailsProps> = ({isCollapsed}) => {

	const { selectedMetas } = useMetasCtx()
	const { selectedRole } = UseRoleContext()

	console.log("We are in RideDetails and look for the selectedRole: ", selectedRole)

	const { measurements, setMeasurements } = useMeasurementsCtx()
	const [ addChecked, setAddChecked ] = useState<boolean>(false)
	
	const add_measurement_popup = addMeasPopup()
	const modify_measurements_popup = addMeasPopup() //modifyMeasurementChoices()

	const edit_Measurement = (meas: ActiveMeasProperties, i: number) => (e: React.MouseEvent) => {
		e.preventDefault()
		e.stopPropagation()

		modify_measurements_popup( 
			(newMeas: ActiveMeasProperties) => {
				const temp = [...measurements]
				temp[i] = newMeas;
				setMeasurements( temp )
				editMeasurement(newMeas, i, selectedRole.role)
			}, 
			{ ...RENDERER_MEAS_PROPERTIES, ...meas } 
		)
	}

	const delete_measurement = ( i: number) => (e: React.MouseEvent) => {
		e.preventDefault()
		e.stopPropagation()
		//removes one element in position i from the state
		const temp = [...measurements]
		temp.splice(i,1)
		setMeasurements(temp)
		// and add the measurement to the measurements.json file
		deleteMeasurement(i, selectedRole.role);
	}

	const showAddMeasurement = () => {
		setAddChecked(true) 
		add_measurement_popup( 
			(newMeasurement: ActiveMeasProperties ) => {
				setAddChecked(false) 
				// update the state in RideDetails
				setMeasurements( prev => [...prev, newMeasurement])
				// and add the measurement to the measurements.json file
				addMeasurement(newMeasurement, selectedRole.role);
			},
			{ ...RENDERER_MEAS_PROPERTIES} 
		)
	}

    const selectMeasurement = (i: number) => (isChecked: boolean) => {        
        const temp = [...measurements]
        temp[i].isActive = isChecked

		if(temp[i].isActive){
		for(let i2 =0; i2< temp.length;i2++){
			if(i!=i2){
				temp[i2].isActive = false;
			}}}

			
		setMeasurements(temp)

    }

	//shows first all measurements and then the checkbox to add new measurement
    return (
		<div className={`meta-data${isCollapsed? " hidden" : ""}`}>
			{ measurements.map( (m: ActiveMeasProperties, i: number) =>
				<MeasCheckbox 
					key={`meas-checkbox-${i}`}
					meas={m}
					selectMeasurement={selectMeasurement(i)}
					editMeasurement={edit_Measurement(m, i)}
					deleteMeasurement={delete_measurement(i)}
					state={m.isActive}
					 />
			) }
			{/*+*/}
			<Checkbox 
				className='ride-metadata-checkbox md-checkbox-add'
				html={<div>Add Measurement</div>} 
				forceState={addChecked}
				onClick={showAddMeasurement} />
			
			{ selectedMetas.map( (meta: RideMeta, i: number) =>
				<MetaData md={meta} key={`md-${Math.random()}`} />
			) }
        </div>
  )
}

export default RideDetails;