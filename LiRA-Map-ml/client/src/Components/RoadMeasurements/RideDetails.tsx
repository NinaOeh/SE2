// modified by Nina Oehlckers (s213535) --> added dropdown, delete measurements, popup modification, enable measurement saving for role
// modified by Caroline (s194570), Andreas (s194614) --> collapser
// modified by Cecilie Do (s185394), Michael Bendtsen (s214954) --> restriction on measurement selection

import React, { FC, useState } from "react";
import addMeasPopup from "./Popup/addMeasurementPopup";
import Checkbox from "../Checkbox";
import MetaData from "./MetaData";

import { useMeasurementsCtx } from "../../context/MeasurementsContext";
import { useMetasCtx } from "../../context/MetasContext";
import { UseRoleContext } from "../../context/RolesContext";

import { addMeasurement, deleteMeasurement, editMeasurement } from "../../queries/measurements";
import { ActiveMeasProperties } from "../../models/properties";
import { RideMeta } from "../../models/models";

import { RENDERER_MEAS_PROPERTIES } from "../Map/constants";

import MeasCheckbox from "./MeasCheckbox";

import '../../css/ridedetails.css'


interface RideDetailsProps {
	isCollapsed: boolean;
}

const RideDetails: FC<RideDetailsProps> = ({isCollapsed}) => {

	const { selectedMetas } = useMetasCtx()
	//Author: Nina (s213535)
	const { selectedRole } = UseRoleContext()

	const { measurements, setMeasurements } = useMeasurementsCtx()
	const [ addChecked, setAddChecked ] = useState<boolean>(false)
	
	const add_measurement_popup = addMeasPopup()
	const modify_measurements_popup = addMeasPopup() 

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

	//Author: Nina (s213535)
	const delete_measurement = ( i: number) => (e: React.MouseEvent) => {
		e.preventDefault()
		e.stopPropagation()
		// removes one element in position i from the state
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
	//Author: Cecilie Do (s185394), Michael Bendtsen (s214954)
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
		//Author: Caroline (s194570), Andreas (s194614) (collapsing function)
		<div className={`meta-data${isCollapsed? " hidden" : ""}`}>
			{ measurements.map( (m: ActiveMeasProperties, i: number) =>
				<MeasCheckbox 
					key={`meas-checkbox-${i}`}
					meas={m}
					selectMeasurement={selectMeasurement(i)}
					//Author: Nina (s213535)
					editMeasurement={edit_Measurement(m, i)}
					deleteMeasurement={delete_measurement(i)}
					//Author: Cecilie Do (s185394), Michael Bendtsen (s214954)
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