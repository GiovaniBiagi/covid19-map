import React from "react";
import Dashboard from './Dashboard';
import { Route, Switch } from "react-router-dom";

const Routes = () => (
    <Switch>
        <Route path="/dashboard" exact component={Dashboard}/>
    </Switch>
);

export default Routes;