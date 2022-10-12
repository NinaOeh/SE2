import { FC } from "react";
import { NavLink } from 'react-router-dom';

import { Nav } from "../models/nav";

import '../css/navbar.css';

import {AiFillHome} from "react-icons/ai"


interface NavBtnProps {
    key: string;
    to: string;
    name: any;
}

const NavBtn: FC<NavBtnProps> = ( { key, to, name } ) => {
    return (
        <NavLink 
            className='nav-tab' 
            activeClassName="nav-tab-active" 
            key= {key}
            to={to}
            exact= {true}
        >
            { name }
        </NavLink>
    )
}

interface INavbar {
    routes: Nav[];
}

const Navbar: FC<INavbar> = ( { routes } ) => {
    return (
        <div className="nav-wrapper">
            <div className="nav-container">
                <div className="nav-block">
                    <NavBtn  key={'home'} to='/' name="Home"/> {/*{AiFillHome}*/}
                </div>
                <div className="nav-block">
                    { routes.map( ([path, _, name], i) => 
                        <NavBtn key={`navbtn-${i}`} to={path} name={name} />
                    ) }
                </div>
                <div className="nav-block">
                    <NavBtn  key={'login'} to='/login' name='Login' />
                </div>
            </div>
        </div>
    )
}

export default Navbar;
