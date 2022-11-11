import React, { useState } from "react";
import DropDown from "./DropDown";
import "../../css/filter.css";
import { useGraph } from "../../context/GraphContext";


const Menu: React.FC = ()=> {

  const [showDropDown, setShowDropDown] = useState<boolean>(false);
  const {filter, setfilter} = useGraph();
  const numbers = () => {
    return [0,1,2,3,4,5,6,7,8];
  };

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
   * city name from the child component
   *
   * @param city  The selected city
   */
  const filterSelection = (number: number): void => {
    setfilter(number);
  };

  return (
    <>
      <div className="announcement">
        <div>
          {filter
            ? `You selected ${filter} for your travel destination`
            : "Select your travel destination"}
        </div>
      </div>
      <button
        className={showDropDown ? "active" : undefined}
        onClick={(): void => toggleDropDown()}
        onBlur={(e: React.FocusEvent<HTMLButtonElement>): void =>
          dismissHandler(e)
        }
      >
        <div>{filter ? "Select: " + filter : "Select ..."} </div>
        {showDropDown && (
          <DropDown
            numbers={numbers()}
            showDropDown={false}
            toggleDropDown={(): void => toggleDropDown()}
            filterSelection={filterSelection}
          />
        )}
      </button>
    </>
  );
  
};

export default Menu;
