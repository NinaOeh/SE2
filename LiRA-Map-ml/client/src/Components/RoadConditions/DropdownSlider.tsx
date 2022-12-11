import React, { useState } from 'react'
import { useGraph } from '../../context/GraphContext';
import '../../css/dropdownslider.css'

const DropdownSlider: React.FC = () => {

    const { filter, setfilter, setType,setfriction } = useGraph();
    const [state, setState] = useState(false);
    const [itemtext, setItemText] = useState('Select condition type');

    const toggle = () => {
        setState(!state)
    }

    const setIRI = () => {
        setType('IRI')
        setItemText('IRI')
        setState(false)
        setfriction(false)
    }
    const setFriction = () => {
        setType('Friction')
        setItemText('Friction')
        setState(false)
        setfriction(true)

    }
    const setFrictionOccurence = () => {
        setType('FirctionOccurence')
        setItemText('Friction - Occurence')
        setState(false)
        setfriction(true)
    }

    return (
        <div className='DropdownWrapper'>
            <button className='DropdownButton' onClick={toggle}> {itemtext} </button>
            <div className={state ? 'DropdownOptions' : 'DropdownOptions-toggled'}>
                <button className='DropdownLink' onClick={setIRI}> IRI </button>
                <button className='DropdownLink' onClick={setFriction}> Friction </button>
                <button className='DropdownLink' onClick={setFrictionOccurence}> Friction – Occurence </button>
            </div>
        </div>
    )
}

export default DropdownSlider