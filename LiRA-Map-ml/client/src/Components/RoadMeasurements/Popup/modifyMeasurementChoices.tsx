import { ActiveMeasProperties } from "../../../models/properties";

import PopupWrapper from "./PopupWrapper";
import createPopup from "../../createPopup";

import '../../../css/popup.css'
import { useState } from "react";


const modifyMeasurementChoices = () => {

    const popup = createPopup<ActiveMeasProperties>()

    return ( callback: (measurement: ActiveMeasProperties) => void, defaultOptions: Required<ActiveMeasProperties> ) => {

        // setOptions( defaultOptions )
        let options = { ...defaultOptions }

        //showDenyButton: true,
        //denyButtonColor: '#d33',
        //denyButtonText: 'Delete Measurement',

        /*if (result.isDenied) {
                console.log("this should be deleted")        
                popup( {
                    title: <p>Measurement <b>{options.name}</b> deleted.</p>,
                    //timer: 3000,
                    //timerProgressBar: true,
                    toast: true
                } )
            }*/

        /*html: <PopupWrapper
                defaultOptions={defaultOptions}
                setOptions={opts => {
                    options = opts
                }} />,*/
        popup( {
            title: <p>Choose the measurement you wish to visualize.</p>,
            showCancelButton: true,
            cancelButtonColor: '#d33',
            confirmButtonText: 'Save Changes',
        } )
        .then( (result: any) => {
            if (result.isConfirmed) {
                callback(options)
                console.log("this should be updated") 
                popup( {
                    title: <p>Measurement <b>{options.name}</b> added / modified</p>,
                    footer: `Will be drawn as ${options.rendererName}`,
                    icon: 'success',
                    //timer: 3000,
                    //timerProgressBar: true,
                    toast: true
                } )
            }
            else {
                console.log("this should be cancelled")
                return
            }

            
        })
    }
}

export default modifyMeasurementChoices;