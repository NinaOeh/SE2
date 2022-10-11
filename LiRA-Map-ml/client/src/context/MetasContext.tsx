import {
	createContext,
	Dispatch,
	SetStateAction,
	useContext,
	useEffect,
	useState,
} from "react";
import { RideMeta } from "../models/models";
import { getRides } from "../queries/rides";


interface ContextProps {
	metas: RideMeta[];
	selectedMetas: RideMeta[];
    setSelectedMetas: Dispatch<SetStateAction<RideMeta[]>>;
}

const MetasContext = createContext({} as ContextProps);

export const MetasProvider = ({ children }: any) => {

	console.log("MetasProvider1")

	const [ metas, setMetas ] = useState<RideMeta[]>([]);
    const [ selectedMetas, setSelectedMetas ] = useState<RideMeta[]>([]);
	console.log("MetasProvider2")

    // fetch the metadata of all the rides
    useEffect( () => getRides(setMetas), [] );

	console.log("MetasProvider3")

	return (
		<MetasContext.Provider
			value={{
				metas,
				selectedMetas,
				setSelectedMetas,
			}}
		>
			{children}
		</MetasContext.Provider>
	);
};

export const useMetasCtx = () => useContext(MetasContext);