import { FC } from "react";
import { BrowserRouter as Router, Route, Switch  } from 'react-router-dom';

import Navbar from './Components/Navbar'
import RoadMeasurements from "./pages/RoadMeasurements";
import RoadConditions from "./pages/RoadConditions";
import Altitude from "./pages/Altitude";
import CarData from "./pages/CarData";
import Login from "./pages/Login";

import { Nav } from "./models/nav";

import "./App.css";

// it's coded in a circle, instead of "hard-coding" the navigation bar, it is 
// dependent on the defined Routes: this should be changed and just hard-coded!
const routes: Nav[] = [
    ['/road_measurements', RoadMeasurements, 'Measurements'],
    ['/road_conditions', RoadConditions, 'Road Conditions'],
    ['/cardata', CarData, 'TestSide'],
    ['/altitude', Altitude, 'Altitude'],
]


//['/cardata', CarData, 'TestSide'],
//['/', RoadMeasurements, 'Measurements'],

const App: FC = () => {
    return (
        <div className="App">
            <Router>
                <Navbar routes={routes} />
                <Switch>
                    { routes.map( ([path, Component, _], i) =>
                        <Route exact key={`route-${i}`} path={path} component={Component} />
                    ) }
                    <Route exact path='/login' component={Login} />
                </Switch>
            </Router>
        </div>
    );
}

export default App;