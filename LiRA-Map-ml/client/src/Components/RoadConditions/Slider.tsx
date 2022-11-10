import { useEffect, useState } from 'react';
import { useGraph } from '../../context/GraphContext';
import React from 'react'
import '../../css/slider.css'

const TypeChanger: React.FC = () => {

    const { filter, setfilter } = useGraph();
    const changeWidth = (event: React.ChangeEvent<HTMLInputElement>) => {
        setfilter(parseFloat(event.target.value));
    }
    const [state, setState] = useState(false);
    const toggle = () => {
        setState(!state)
    }

    const irimax = 10;
    const iristep = 1
    const frictionmax = 1;
    const frictionstep = 0.1;

    useEffect(() => {
        setfilter(state ? irimax : frictionmax)
    }, [state])

    useEffect(() => {
        console.log({ filter })
    }, [filter])

    return (
        <div className='changer-wrapper'>
            <div className='slider-wrapper'>
                <input className='slider'
                    type='range'
                    onChange={changeWidth}
                    min={0}
                    max={state ? irimax : frictionmax}
                    step={state ? iristep : frictionstep}
                    value={filter}
                ></input>
            </div>
            <p className='value-number'>{filter}</p>
            <button className={state ? 'button-iri' : 'button-iri-toggled'} onClick={state ? toggle : undefined}>IRI</button>
            <button className={state ? 'button-friction-toggled' : 'button-friction'} onClick={state ? undefined : toggle}>F</button>
        </div>
    )
}

export default TypeChanger