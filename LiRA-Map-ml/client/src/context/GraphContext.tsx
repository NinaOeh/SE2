import {
	createContext,
	Dispatch,
	SetStateAction,
	useContext,
	useState,
} from "react";

import useMinMaxAxis from "../hooks/useMinMaxAxis";
import { AddMinMaxFunc, DotHover, RemMinMaxFunc } from "../assets/graph/types";


interface ContextProps {
	minX: number;
	maxX: number;
	minY: number;
	maxY: number;

    addBounds: AddMinMaxFunc;
	remBounds: RemMinMaxFunc;

	dotHover: DotHover | undefined;
	setDotHover: Dispatch<SetStateAction<DotHover | undefined>>;

	filter:number;
	setfilter:Dispatch<SetStateAction<number>>;

	//todo change when type is ready
	friction:boolean;
	setfriction:Dispatch<SetStateAction<boolean>>;
}

const GraphContext = createContext({} as ContextProps);

// TODO: remove bounds / refactor?  -> is it needed really?
// TODO: generalize DotHover into an "Event State" (to support for more events at once)
export const GraphProvider = ({ children }: any) => {

	const { bounds, addBounds, remBounds } = useMinMaxAxis()
	const [ dotHover, setDotHover ] = useState<DotHover>()


	const [filter, setfilter]=useState<number>(0) //ENUMERATION UPGRADE 
	//have another for FMT 

	const[friction,setfriction]=useState<boolean>(false);

	const { minX, maxX, minY, maxY } = bounds;

	return (
		<GraphContext.Provider
			value={{
				minX, maxX, minY, maxY,
				addBounds, remBounds,
				dotHover, setDotHover,
				filter, setfilter,
				friction, setfriction
			}}
		>
			{children}
		</GraphContext.Provider>
	);
};

export const useGraph = () => useContext(GraphContext);