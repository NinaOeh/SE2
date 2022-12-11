import React from "react"
import { SegmentProvider } from "../context/SegmentContext"

const Home = () => {
    return (
        <SegmentProvider>
                <div className='home_container'>
                    <h2>Hello, this is the Home page of the LiRA Map extension. Welcome! </h2>
                    <p/>
                    <h6>The web application is part of the life road assessment project 
                         <a href='https://lira-project.dk/'> LiRA</a>. </h6>
                    <h6>Road maintenance has always been a major challenge.
                        To address decision-making departments, many different road measures and methods have been developed. 
                        Both structural and functional conditions are quantified; the first defines the degree of deterioration 
                        of the materials and layers used in the pavement structure while the second quantify the quality of the 
                        driving conditions. These two conditions are not independent of each other because when a road pavement 
                        is in poor quality its functionality also get compromised. 
                        However a lot of municipalities do not use data and instead they do a visual inspection. 
                        This is not always objective and it is dependent on the experience of the person in charge.
                        LiRA will give objective data based on parameters as IRI, Rut Depth, Friction, etc. Currently 
                        the LiRA Map also shows all data collected from cars on a map. </h6> 
                    <p/>
                    <h4>To get started please select or add a new role before you start looking at the available data.
                    <h4>After a role has been chosen or added, the Measurements page visualizes the actual measurements of the car sensors. 
                        Here, you can choose between the different measurements, filter the trips according to your interest and see the 
                        results in the map and graph.</h4>
                    <h4>In the Road conditions page, the calculated road conditions can be inspected. These are currently the IRI and friction 
                        for the available road segments. Over time this data will be extended to further trips and road condition types.
                    </h4>

                    </h4>
                </div> 
        </SegmentProvider>
    )
}

export default Home