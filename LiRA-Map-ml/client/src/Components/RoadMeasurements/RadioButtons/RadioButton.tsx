import React, { useState } from "react";

interface Props{
  html: JSX.Element;
	name?: string;
  measurement?: string;
	style?: React.CSSProperties;
  onChange: (isChecked: string, e: React.MouseEvent<HTMLDivElement>) => void;
}

const RadioButton = (props: Props) => {
   const [selectedMeasurement, setSelectedMeasurement] = useState<string>();
   
   // This function will be triggered when a radio button is selected
   const radioHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
       setSelectedMeasurement(event.target.value);
     };

   const { measurement, html, style, name } = props;

   return (
   <div>
      <label>
      <div>
        <input
          type="radio"
          value={measurement}
          name={name}
          onChange={radioHandler}
        />
        {name}
        {selectedMeasurement && <h2>{selectedMeasurement}</h2>}
      </div>
    </label>
   </div>
   );
}

export default RadioButton
   