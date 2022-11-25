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

import { createBrowserHistory } from "history";


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

	console.log("We are in MeasurementsContext and the selected role is", selectedRole.role)

	useEffect( () => getMeasurements(selectedRole.role, setMeasurements), [selectedRole] )

	console.log("measurements", measurements)


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