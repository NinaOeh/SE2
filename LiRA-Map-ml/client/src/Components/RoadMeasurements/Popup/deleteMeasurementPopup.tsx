import { ActiveMeasProperties } from "../../../models/properties";
import createPopup from "../../createPopup";

const deletePopup = () => {
    const popup = createPopup<any>()
    return(
        popup( {
            title: <p>Measurement deleted.</p>,
            //timer: 3000,
            //timerProgressBar: true,
            toast: true
        } )
    )
}

export default deletePopup