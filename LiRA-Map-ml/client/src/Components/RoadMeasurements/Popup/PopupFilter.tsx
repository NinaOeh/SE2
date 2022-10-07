import { ActiveFilProperties } from "../../../models/properties";

import PopupFilWrapper from "./PopupFilWrapper";
import createPopup from "../../createPopup";

import '../../../css/popup.css'

const PopupFilter = () => {

    const popup = createPopup<ActiveFilProperties>()

    return ( callback: (measurement: ActiveFilProperties) => void, defaultOptions: Required<ActiveFilProperties>) => {

        let options = {...defaultOptions }
        popup({
            title: <p>Enter the minimum IRI (Between 0 and 10)</p>,
            showCancelButton: true,
            cancelButtonColor: '#d33',
            confirmButtonText: 'Add',
            html: <PopupFilWrapper
                defaultOptions={defaultOptions}
                setOptions={opts => {
                    console.log(opts);
                    options = opts
                }}/>,
        })
        .then( (result: any) => {
            if ( !result.isConfirmed || options === undefined )
                return

            callback(options)

            popup( {
                title: <p>Filter <b>{options.dFilter}</b> added / modified</p>,
                icon: 'success',
                timer: 1500,
                timerProgressBar: true,
                toast: true
            })
        })
    }
}

export default PopupFilter