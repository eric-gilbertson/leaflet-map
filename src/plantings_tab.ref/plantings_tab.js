import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

// import requirements for top nav bar - these should really be in app.js but that is not working
import '../../scripts_legacy/dist/bootstrap/bootstrap';
import '../../scripts_legacy/dist/bootstrap/bootstrap-toggle';

import '../../styles/dashboard.scss';

// TBD: this assume similar defaults, need to determine how to combine stores
import ConfigureStore from './ConfigureStore';
import PlantingsTab from "./PlantingsTab";

console.log("plantings_tab.js xxxxxxxxxxxxx enter xxxxxxxxx");

/*
ReactDOM.render(
    <Provider store={ConfigureStore()}>
        <PlantingsTab />
    </Provider>,
    document.getElementById('plantings-tab')
);
*/
