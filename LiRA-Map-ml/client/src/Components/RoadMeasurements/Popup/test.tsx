import React, { useState } from "react";
import "../../../css/test.css";

const Test = () => {
  // The selected drink
  const [selectedMeasurement, setSelectedMeasurement] = useState<String>();

  // This function will be triggered when a radio button is selected
  const radioHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedMeasurement(event.target.value);
  };

  return (
    <div className="container">
      <h3>KindaCode.com</h3>
      <fieldset>
        <legend>Please select the measurement.</legend>
        <p>
          <input
            type="radio"
            name="drink"
            value="Coffee"
            id="coffee"
            onChange={radioHandler}
          />
          <label htmlFor="coffee">Coffee</label>
        </p>

        <p>
          <input
            type="radio"
            name="drink"
            value="Tea"
            id="tea"
            onChange={radioHandler}
          />
          <label htmlFor="tea">Green Tea</label>
        </p>

        <p>
          <input
            type="radio"
            name="drink"
            value="Pumpkin Juice"
            id="pumpkin"
            onChange={radioHandler}
          />
          <label htmlFor="pumpkin">Pumpkin Juice</label>
        </p>
      </fieldset>

      {/* Display the selected drink */}
      {selectedMeasurement && <h2>{selectedMeasurement}</h2>}
    </div>
  );
}

export default Test;