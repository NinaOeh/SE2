import { FC, useEffect, useState, ReactNode } from "react";
import { List, ListRowRenderer } from "react-virtualized";

import Checkbox from '../Checkbox';
import { parsePositionDisplay } from '../../assets/DataParsers';

import { RideMeta, TripsOptions } from '../../models/models'

import '../../css/ridecard.css'
import '../../css/spinner.css'
import { useMetasCtx } from "../../context/MetasContext";
import OptionsSelector from "./OptionsSelector";

//Code regarding hovered meta

interface CardsProps {
    showMetas: SelectMeta[]
    onClick: (meta: SelectMeta, i: number, isChecked: boolean) => void;
    onMouseEnter?: (i: number, isChecked: boolean) => void;
    onMouseLeave?: (i: number, isChecked: boolean) => void;
    //Author: Caroline (s194570), Andreas (s194614)
    hoveredMeta?: RideMeta;
}

const Cards: FC<CardsProps> = ( { showMetas, onClick, onMouseEnter, onMouseLeave, hoveredMeta } ) => {  
    const renderRow: ListRowRenderer = ( { index, key, style } ): ReactNode => {
        const meta = showMetas[index];

        //Author: Caroline (s194570), Andreas (s194614)
        const positionDisplays = parsePositionDisplay(meta.StartPositionDisplay, meta.EndPositionDisplay);
        const isHoveredMeta = hoveredMeta && hoveredMeta.TaskId == meta.TaskId;
        return <div key={key} style={style}>
            <Checkbox 
                forceState={meta.selected}
                //Author: Caroline (s194570), Andreas (s194614)
                className={`ride-card-container${isHoveredMeta? " hovered-meta" : ""}`}
                html={<div>{positionDisplays.StartPosition + " -> "}<br/>{positionDisplays.EndPosition}<br/>{new Date(meta.Created_Date).toLocaleDateString()}</div>}
                onClick={(isChecked) => {
                    onClick(meta, index, isChecked) 
                }}
                //Author: Caroline (s194570), Andreas (s194614)
                onMouseEnter={(isChecked) => {
                    onMouseEnter!(index, isChecked);
                }}
                onMouseLeave={(isChecked) => {
                    onMouseLeave!(index, isChecked);
                }}
                />
        </div>
    }

    return <List
        width={190}
        height={2500}
        rowHeight={100}
        rowRenderer={renderRow}
        rowCount={showMetas.length} /> 
}

//Author: Caroline (s194570), Andreas (s194614)
interface SelectMeta extends RideMeta {
    selected: boolean;
}

interface RideCardProps {
    isCollapsed: boolean;
}

const RideCards: FC<RideCardProps> = ( {isCollapsed} ) => {   
    
    const { metas, selectedMetas, setSelectedMetas, hoveredMeta, setHoveredMeta } = useMetasCtx();

    const [showMetas, setShowMetas] = useState<SelectMeta[]>([])
    
    useEffect( () => {
        setShowMetas( metas.map(m => ({...m, selected: false})) )
    }, [metas])
    
    useEffect( () => {
        console.log("this is triggered from mouseoverevent, hovered meta is: ", hoveredMeta);
    }, [hoveredMeta]);

    const onChange = ( { search, startDate, endDate, reversed }: TripsOptions) => {
        const temp: SelectMeta[] = metas
            .filter( (meta: RideMeta) => {
                const inSearch = search === "" || meta.TaskId.toString().includes(search)
                const date = new Date(meta.Created_Date).getTime()
                const inDate = date >= startDate.getTime() && date <= endDate.getTime()
                //Author: Caroline (s194570), Andreas (s194614)
                const inStartPositionDisplay = meta.StartPositionDisplay.toLowerCase().includes(search.toLowerCase());
                return (inSearch || inStartPositionDisplay) && inDate
            } )
            .map( (meta: RideMeta) => {
                const selected = selectedMetas.find( ( { TripId } ) => meta.TripId === TripId ) !== undefined
                return { ...meta, selected }
            } )
        setShowMetas( reversed ? temp.reverse() : temp )
    }

    const onClick = ( md: SelectMeta, i: number, isChecked: boolean) => {
        const temp = [...showMetas]
        temp[i].selected = isChecked
        setShowMetas(temp)

        //Author: Caroline (s194570), Andreas (s194614)
        if(isChecked) {
            const res = selectedMetas.find(elem => elem.TripId === temp[i].TripId);
            if(res !== undefined){
                setSelectedMetas(prev => prev.filter( ({ TripId }) => temp[i].TripId !== TripId ) );
            }
            setSelectedMetas(prev => [...prev, temp[i]]);
        } else {
            return setSelectedMetas( prev => prev.filter( ({ TripId }) => md.TripId !== TripId ) );
        }
        return
    }

    //Author: Caroline (s194570), Andreas (s194614)
    const onMouseEnter = (i: number, isChecked: boolean) => {
        const temp = [...showMetas][i];
        const res = selectedMetas.find(elem => elem.TripId === temp.TripId);
        if(res === undefined){
            setSelectedMetas(prev => [...prev, temp]);
        }
    }

    //Author: Caroline (s194570), Andreas (s194614)
    const onMouseLeave = (i: number, isChecked: boolean) => {
        const temp = [...showMetas][i];
        if(!isChecked){
            setSelectedMetas(prev => prev.filter( ({ TripId }) => temp.TripId !== TripId ) );
        }
    }
    
    return (
        //Author: Caroline (s194570), Andreas (s194614) (collapsing function)
        <div className={`ride-list${isCollapsed? " hidden" : ""}`}>
            <OptionsSelector onChange={onChange}/>
            <Cards showMetas={showMetas} onClick={onClick} onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave} hoveredMeta={hoveredMeta}/>            
        </div>
    )
}

export default RideCards;
