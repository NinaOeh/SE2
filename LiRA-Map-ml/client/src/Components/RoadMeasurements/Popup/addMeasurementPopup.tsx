// modified by Nina Oehlckers (s213535)

import { ActiveMeasProperties } from "../../../models/properties";

import PopupWrapper from "./PopupWrapper";
import createPopup from "../../createPopup";

import '../../../css/popup.css'


const addMeasPopup = () => {

    const popup = createPopup<ActiveMeasProperties>()

    return ( callback: (measurement: ActiveMeasProperties) => void, defaultOptions: Required<ActiveMeasProperties> ) => {

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
        })

    }
}

export default addMeasPopup;


