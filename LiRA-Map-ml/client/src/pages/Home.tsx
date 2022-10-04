import React from "react"
import { SegmentProvider } from "../context/SegmentContext"

const Home = () => {
    return (
        <SegmentProvider>
            <div className='signup-wrapper'>
                <div>
                    <h2>"Hello, this is the Home page of the LiRA project. Welcome!"</h2>
                </div>
            </div>
        </SegmentProvider>
    )
}

export default Home