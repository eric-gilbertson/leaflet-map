import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

// import requirements for top nav bar - these should really be in app.js but that is not working
import '../../scripts_legacy/dist/bootstrap/bootstrap';
import '../../scripts_legacy/dist/bootstrap/bootstrap-toggle';

// TBD: this assume similar defaults, need to determine how to combine stores
import ConfigureStore from './ConfigureStore';
import PlantingsTab from "./PlantingsTab";
import {getBlockInfoDone} from "./PlantingsActions"


let plantingsStore = null;

export function renderPlantingsTab(blockInfo) {
    //First time in we render the tab, otherwise just update
    //the data model.
    if (!plantingStore) {
        plantingsStore = ConfigureStore({});
        ReactDOM.render(
            <Provider store={plantingsStore}>
                <PlantingsTab />
            </Provider>, 
            document.getElementById('plantings-tab')
         );
    }
    plantingsStore.dispatch(getBlockInfoDone(blockInfo));
}
