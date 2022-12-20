// created by Nina Oehlckers (s213535)
import createPopup from "../../createPopup";

const deletePopup = () => {
    const popup = createPopup<any>()
    return(
        popup( {
            title: <p>Measurement deleted.</p>as any,
            toast: true
        } )
    )
}

export default deletePopup