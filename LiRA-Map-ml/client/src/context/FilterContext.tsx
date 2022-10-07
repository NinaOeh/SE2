import {
	createContext,
	Dispatch,
	SetStateAction,
	useContext,
	useEffect,
	useState,
} from "react";

import { ActiveFilProperties } from "../models/properties";
import { getMeasurements } from "../queries/filters";

interface ContextProps {
	measurements: ActiveFilProperties[];
    setMeasurements: Dispatch<SetStateAction<ActiveFilProperties[]>>;
	selectedMeasurements: ActiveFilProperties[];
}

const FilterContext = createContext({} as ContextProps);

export const FilterProvider = ({ children }: any) => {

	const [ measurements, setMeasurements ] = useState<ActiveFilProperties[]>([])
	const [ selectedMeasurements, setSelectedMeasurements ] = useState<ActiveFilProperties[]>([])

	useEffect( () => setSelectedMeasurements( measurements.filter(m => m.isActive)), [measurements] )

	useEffect( () => getMeasurements(setMeasurements), [] )

	return (
		<FilterContext.Provider
			value={{
				measurements,
				setMeasurements,
				selectedMeasurements
			}}
		>
			{children}
		</FilterContext.Provider>
	);
};

export const useFilterCtx = () => useContext(FilterContext);