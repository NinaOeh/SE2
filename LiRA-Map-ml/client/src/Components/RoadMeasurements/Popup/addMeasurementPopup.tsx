

import { ActiveMeasProperties } from "../../../models/properties";

import PopupWrapper from "./PopupWrapper";
import createPopup from "../../createPopup";

import '../../../css/popup.css'
import { useState } from "react";


const addMeasPopup = () => {

    const popup = createPopup<ActiveMeasProperties>()

    return ( callback: (measurement: ActiveMeasProperties) => void, defaultOptions: Required<ActiveMeasProperties> ) => {

        // setOptions( defaultOptions )
        let options = { ...defaultOptions }

        popup( {
            title: <h2>Measurement Setup</h2> as any,
            showCancelButton: true,
            cancelButtonColor: '#d33',
            confirmButtonText: 'Add/Change',
            html: <PopupWrapper
                defaultOptions={defaultOptions}
                setOptions={opts => {
                    options = opts
                }} /> as any,
        } )
        .then( (result: any) => {
            if ( !result.isConfirmed || options === undefined )
                return

            callback(options)
    
            popup( {
                title: <p>Measurement <b>{options.name}</b> added / modified</p>,
                footer: `Will be drawn as ${options.rendererName}`,
                //icon: 'success',
                //timer: 1500,
                //timerProgressBar: true,
                toast: true
            } )
        })

    }
}

export default addMeasPopup;


