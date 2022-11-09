import { useState } from 'react';
import { RiPrinterFill } from 'react-icons/ri';
import { useGraph } from '../../context/GraphContext';

const Slider: React.FC = ()=> {
    const {filter, setfilter} = useGraph();
    const changeWidth = (event: React.ChangeEvent<HTMLInputElement>) => {
        console.log("herehere:",event.target.value);
        setfilter(parseInt(event.target.value));
      };
      return (

            <div className='slider-hover'>

                {/* A range slider with default appearance */}
                <h4>Enter the filter: {filter}</h4>
                <input
                type='range'
                onChange={changeWidth}
                min={0}
                max={10}
                step={1}
                value={filter}
                ></input>

            </div>
      );


}

export default Slider;
