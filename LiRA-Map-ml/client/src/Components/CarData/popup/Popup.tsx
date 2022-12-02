
import { SegTypes } from "../../../pages/CarData";
import usePopup from "../../createPopup";
import FilterPopup from "./TypesPopup";
import React, { useState } from 'react';
import Popup from './Popuptest';
 
function useTypesPopup() {
  const [isOpen, setIsOpen] = useState(true);
  const togglePopup = () => {
    setIsOpen(!isOpen);
  }
 
  return <div>
    <input
      type="button"
      value="Click to Open Popup"
      onClick={togglePopup}
    />
    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
    {isOpen && <Popup
      content={<>
        <b>Design your Popup</b>
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
        <button>Test button</button>
      </>}
      handleClose={togglePopup}
    />}
  </div>
}
 
export default useTypesPopup;


// const useTypesPopup = (types: SegTypes) => {

//     const popup = usePopup(types)

//     return { fire: ( callback: (opt: SegTypes) => void ) => {

//         popup.fire( {
//             titleText: 'Please choose the filters you wish to use',
//             showCancelButton: true,
//             cancelButtonColor: '#d33',
//             confirmButtonText: 'Add',
//             html: <FilterPopup types={popup.state} setTypes={popup.setState}/>,
//         } )
//         .then( (result: any) => {
//             console.log(result, popup.state);
//             result.isConfirmed && callback(popup.state)
//         } )

//     } }
// }

// export default useTypesPopup;

