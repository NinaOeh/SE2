//ELiot Ullmo

import { useEffect, useState } from 'react';
import { useGraph } from '../../context/GraphContext';
import React from 'react'
import '../../css/slider.css'
import DropdownSlider from './DropdownSlider';

const TypeChanger: React.FC = () => {
    const { filter, setfilter, typeCondition } = useGraph();
    const changeWidth = (event: React.ChangeEvent<HTMLInputElement>) => {
        setfilter(parseFloat(event.target.value));
    }

    const irimax = 10;
    const iristep = 1
    const frictionmax = 3;
    const frictionstep = 0.2;
    const frictionoccurencemax = 10;
    const frictionoccurencestep = 1;

    var max
    var step

    if (typeCondition === 'Friction') {
        max = frictionmax
        step = frictionstep
    }
    if (typeCondition === 'FrictionOccurence') {
        max = frictionoccurencemax
        step = frictionoccurencestep
    }
    else {
        max = irimax
        step = iristep
    }

    useEffect(() => {
        setfilter(0);
        
    }, [typeCondition]);

    return (
        <div className='changer-wrapper'>
            <div className='slider-wrapper'>
                <input className='slider'
                    type='range'
                    onChange={changeWidth}
                    min={0}
                    max={max}
                    step={step}
                    value={filter}
                ></input>
            </div>
            <p className='value-number'>{filter}</p>
            <DropdownSlider />
        </div>
    )
}

export default TypeChanger