import React from 'react'
import { Route,Redirect } from "react-router-dom";
import { useSelector } from "react-redux";

const ProtectRoute = (props) => {
    const {authenticate} = useSelector(state=>state.auth);
    return authenticate?<Route path={props.path} component={props.component} exact={props.exact} />:<Redirect to='/messenger/login' />
}

export default ProtectRoute
