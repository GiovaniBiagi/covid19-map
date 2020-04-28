import React from 'react';
import Main from './layout/Main';
import { Route, Switch } from "react-router-dom";

const App = () => (
    <Switch>
        <Route path="/" component={Main} />
    </Switch>

);

export default App;