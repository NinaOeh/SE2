import { useState, useEffect, FC } from "react";
import { NavLink } from 'react-router-dom';

import { FaBars } from 'react-icons/fa';

import '../css/navbar.css';
import { IconContext } from "react-icons";

import { UseRoleContext } from "../context/RolesContext"

// Get window size

function getWindowDimensions() {
    const width = window.innerWidth
    const height = window.innerHeight
    return {
        width,
        height
    };
}

function useWindowDimensions() {
    const [windowDimensions, setWindowDimensions] = useState(getWindowDimensions());
    useEffect(() => {
        function handleResize() {
            setWindowDimensions(getWindowDimensions());
        }
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return windowDimensions;
}

const Navbar: FC = () => {

    interface NavBtnProps {
        to: string;
        name: string;
    }

    const NavBtn: FC<NavBtnProps> = ( { to, name } ) => {
        return (
            <NavLink 
                className= {menuActive ?'nav-tab' : 'nav-tab-side'}
                activeClassName={menuActive ? "nav-tab-active" : "nav-tab-side-active"}
                to={to}
                onClick = {setFalseMenu}
            >
                { name }
            </NavLink>
        )
    }

    // Toggle Menu

    const [menuActive, setMenuActive] = useState(false);

    const toggleMenu = () => {
        setMenuActive(!menuActive);
    };

    const setFalseMenu = () => {
        setMenuActive(true);
    }

    // Toggle Navbar

    useWindowDimensions();

    if(window.innerWidth > 800 && !menuActive) {
        setFalseMenu();
    }

    const {selectedRole} = UseRoleContext();
    let Roledescription = "";

    console.log("The selected Role is: ", selectedRole)
    console.log(Roledescription)

    if (selectedRole.role === ""){
        Roledescription= "Select Role"
    }
    else {
        Roledescription= "Selected Role : "+selectedRole.role
    }

    return (
        <div className="nav-wrapper">
            <div className={menuActive ? "nav-container" : "nav-container-side"}>
                <div className="nav-block">
                    <NavBtn  to='/road_measurements' name='Road Measurements' />
                </div>
                <div className="nav-block">
                    <NavBtn  to='/road_conditions' name='Road Conditions' />
                </div>
                {/* <div className="nav-block">
                    <NavBtn  to='/cardata' name='Cardata' />
                </div> */}
                <div className="nav-block">
                    <NavBtn  to='/altitude' name='Altitude' />
                </div>
                <div className="nav-block">
                    <NavBtn  key={'login'} to='/login' name={Roledescription} />
                </div>
                <button className="toggle-button" onClick={toggleMenu} >
                    <IconContext.Provider value={{ color: 'white', size: '40px' }}>
                        <FaBars />
                    </IconContext.Provider>
                </button>
                <div className="logo">
                    <img src={require( "../LiRA-logo.png")} />
                </div>
            </div>
        </div>
    )
}

export default Navbar;