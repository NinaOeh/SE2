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
	hoveredMeta?: RideMeta;
	setHoveredMeta: Dispatch<SetStateAction<RideMeta | undefined>>;
}

const MetasContext = createContext({} as ContextProps);

export const MetasProvider = ({ children }: any) => {


	const [ metas, setMetas ] = useState<RideMeta[]>([]);
    const [ selectedMetas, setSelectedMetas ] = useState<RideMeta[]>([]);
	const [ hoveredMeta, setHoveredMeta ] = useState<RideMeta>();

    // fetch the metadata of all the rides
    useEffect( () => getRides(setMetas), [] );


	return (
		<MetasContext.Provider
			value={{
				metas,
				selectedMetas,
				setSelectedMetas,
				hoveredMeta,
				setHoveredMeta
			}}
		>
			{children}
		</MetasContext.Provider>
	);
};

export const useMetasCtx = () => useContext(MetasContext);