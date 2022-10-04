import React, { useState } from "react";
import Dropdown from "./Dropdown";
import { MeasurementDatabases } from "../../../models/measurements";

const MeasurementMenu: React.FC = (): JSX.Element => {
  const [showDropDown, setShowDropDown] = useState<boolean>(false);
  const [selectMeasurement, setSelectMeasurement] = useState<string>("");
  /**
   * Toggle the drop down menu
   */
  const toggleDropDown = () => {
    setShowDropDown(!showDropDown);
  };

  /**
   * Hide the drop down menu if click occurs
   * outside of the drop-down element.
   *
   * @param event  The mouse event
   */
  const dismissHandler = (event: React.FocusEvent<HTMLButtonElement>): void => {
    if (event.currentTarget === event.target) {
      setShowDropDown(false);
    }
  };

  /**
   * Callback function to consume the
   * measurement name from the child component
   *
   * @param measurement  The selected measurement
   */
  const measurementSelection = (measurement: string): void => {
    setSelectMeasurement(measurement);
  };

  return (
    <>
      <div className="announcement">
        <div>
          {selectMeasurement
            ? `Selected Measurement: ${selectMeasurement}`
            : "Select what measurement"}
        </div>
      </div>
      <button
        className={showDropDown ? "active" : undefined}
        onClick={(): void => toggleDropDown()}
        onBlur={(e: React.FocusEvent<HTMLButtonElement>): void =>
          dismissHandler(e)
        }
      >
        <div>{selectMeasurement ? "Select: " + selectMeasurement : "Select ..."} </div>
        {showDropDown && (
          <Dropdown
            measurements={Object.keys(MeasurementDatabases)} //cities
            showDropDown={false}
            toggleDropDown={(): void => toggleDropDown()}
            measurementSelection={measurementSelection}
          />
        )}
      </button>
    </>
  );
};

export default MeasurementMenu;