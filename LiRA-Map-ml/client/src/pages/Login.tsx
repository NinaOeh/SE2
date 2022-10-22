import { RolesProvider } from "../context/RolesContext"
import  SelectRole  from "../Components/Roles/DefineRole"

import { post } from "../queries/fetch";

//import '../css/login.css';


const Login = () => { 

    return (
        <RolesProvider>
            <SelectRole/>
        </RolesProvider>
        
    )
}


export default Login;
