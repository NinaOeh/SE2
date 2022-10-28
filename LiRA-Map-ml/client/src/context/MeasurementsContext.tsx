import {
	createContext,
	Dispatch,
	SetStateAction,
	useContext,
	useEffect,
	useState,
} from "react";

import { ActiveMeasProperties } from "../models/properties";
import { getMeasurements } from "../queries/measurements";
import { UseRoleContext } from "./RolesContext";


interface ContextProps {
	measurements: ActiveMeasProperties[];
    setMeasurements: Dispatch<SetStateAction<ActiveMeasProperties[]>>;
	selectedMeasurements: ActiveMeasProperties[];
}

const MeasurementsContext = createContext({} as ContextProps);

export const MeasurementsProvider = ({ children }: any) => {

	const [ measurements, setMeasurements ] = useState<ActiveMeasProperties[]>([])
	const [ selectedMeasurements, setSelectedMeasurements ] = useState<ActiveMeasProperties[]>([])
	const { selectedRole } = UseRoleContext()

	useEffect( () => setSelectedMeasurements( measurements.filter(m => m.isActive)), [measurements] )

	useEffect( () => getMeasurements(selectedRole.role, setMeasurements), [] )

	console.log("MeasurementsProvider");
	console.log(measurements);
	console.log(setMeasurements);
	console.log(selectedMeasurements);
	

	return (
		<MeasurementsContext.Provider
			value={{
				measurements,
				setMeasurements,
				selectedMeasurements
			}}
		>
			{children}
		</MeasurementsContext.Provider>
	);
};

export const useMeasurementsCtx = () => useContext(MeasurementsContext);